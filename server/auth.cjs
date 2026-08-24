const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const https = require('https');
const { findOrCreateUser, getUser, updateUser, saveCode, verifyCode, getUserByEmail, updateUserEmail, saveEmailCode, getLatestUnusedCode, markCodeUsed, invalidateEmailCodes, exec, queryOne, transaction } = require('./db.cjs');
const { sendEmailCode: sendEmail } = require('./email.cjs');
const { requireAuth } = require('./middleware/auth.cjs');

// --- In-memory rate limiter for send-code ---
const rateLimitMap = new Map();
const RATE_WINDOW_MS = 60_000;       // 1 minute window
const RATE_MAX_PER_WINDOW = 3;       // max 3 requests per window per phone
const RATE_CLEANUP_INTERVAL = 300_000; // clean stale entries every 5 min

function checkRateLimit(phone) {
  const now = Date.now();
  let entry = rateLimitMap.get(phone);

  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    // First request or window expired — start a fresh window
    entry = { count: 0, windowStart: now };
    rateLimitMap.set(phone, entry);
  }

  if (entry.count >= RATE_MAX_PER_WINDOW) return false;

  entry.count++;
  return true;
}

// Periodic cleanup to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now - entry.windowStart > RATE_WINDOW_MS) {
      rateLimitMap.delete(key);
    }
  }
}, RATE_CLEANUP_INTERVAL);

const router = express.Router();

// Aliyun SMS config
const ACCESS_KEY = process.env.ALIYUN_ACCESS_KEY;
const ACCESS_SECRET = process.env.ALIYUN_ACCESS_SECRET;
const SIGN_NAME = process.env.SMS_SIGN_NAME;
const TEMPLATE_CODE = process.env.SMS_TEMPLATE_CODE;
const SMS_MODE = process.env.SMS_MODE || 'dev';
const DEV_MODE = process.env.NODE_ENV !== 'production';

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
const JWT_EXPIRY = '7d';
const CODE_EXPIRY_MINUTES = 5;

// Check if request comes from localhost (for dev code disclosure)
function isLocalRequest(req) {
  const ip = (req.ip || req.socket?.remoteAddress || '').replace(/^::ffff:/, '');
  return ip === '127.0.0.1' || ip === '::1' || ip === 'localhost';
}

// Send SMS via Aliyun Dypnsapi (短信认证 SendSmsVerifyCode)
function percentEncode(str) {
  return encodeURIComponent(str).replace(/\+/g, '%20').replace(/\*/g, '%2A').replace(/%7E/g, '~');
}

async function sendSms(phone, code) {
  const params = {
    Action: 'SendSmsVerifyCode',
    Version: '2017-05-25',
    Format: 'JSON',
    AccessKeyId: ACCESS_KEY,
    SignatureMethod: 'HMAC-SHA1',
    Timestamp: new Date().toISOString().split('.')[0] + 'Z',
    SignatureVersion: '1.0',
    SignatureNonce: Date.now().toString(36) + Math.random().toString(36).substring(2, 10),
    PhoneNumber: phone,
    SignName: SIGN_NAME,
    TemplateCode: TEMPLATE_CODE,
    TemplateParam: JSON.stringify({ code, min: String(CODE_EXPIRY_MINUTES) }),
    CodeLength: 4,
    ValidTime: CODE_EXPIRY_MINUTES * 60,
    CodeType: 1,
    ReturnVerifyCode: true,
  };

  // Calculate Aliyun RPC signature
  const sortedKeys = Object.keys(params).sort();
  const canonical = sortedKeys.map(k => `${percentEncode(k)}=${percentEncode(params[k])}`).join('&');
  const strToSign = `POST&${encodeURIComponent('/')}&${percentEncode(canonical)}`;
  params.Signature = crypto.createHmac('sha1', ACCESS_SECRET + '&').update(strToSign).digest('base64');

  // POST request
  const body = new URLSearchParams(params).toString();

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'dypnsapi.aliyuncs.com',
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 10000,
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(new Error(`Invalid response: ${data}`)); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('SMS API timeout')); });
    req.write(body);
    req.end();
  });
}


// POST /api/auth/send-code
router.post('/send-code', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: '请输入正确的中国大陆手机号' });
    }

    // Rate limit: max 3 requests per phone per minute
    if (!checkRateLimit(phone)) {
      console.warn(`[RateLimit] send-code throttled for phone: ${phone}`);
      return res.status(429).json({ success: false, message: '请求过于频繁，请稍后再试' });
    }

    const code = String(Math.floor(1000 + Math.random() * 9000));
    const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000).toISOString();

    // Save code before attempting SMS (will expire naturally if SMS fails)
    await saveCode(phone, code, expiresAt);

    // Attempt to send SMS based on SMS_MODE
    console.log('[SMS] SMS_MODE=' + SMS_MODE + ', sending code to phone:', phone);

    let smsResult = null;
    let smsSuccess = false;

    if (SMS_MODE === 'real' || SMS_MODE === 'production') {
      const credsOk = ACCESS_KEY && ACCESS_SECRET && SIGN_NAME && TEMPLATE_CODE;
      if (credsOk) {
        try {
          smsResult = await sendSms(phone, code);
          console.log('[SMS] API Response:', JSON.stringify(smsResult));
          smsSuccess = smsResult.Code === 'OK';
          if (!smsSuccess) {
            console.error('[SMS] API Error:', smsResult.Code, smsResult.Message);
          }
        } catch (smsErr) {
          console.error('[SMS] Send failed:', smsErr.message);
        }
      } else {
        console.warn('[SMS] Credentials not fully configured (SMS_MODE=' + SMS_MODE + ')');
      }
    } else {
      console.log('[SMS] Dev mode — not calling real SMS API');
    }

    if (smsSuccess) {
      // SMS sent successfully — normal flow
      const response = {
        success: true,
        message: '验证码已发送',
        _expires_in: CODE_EXPIRY_MINUTES * 60,
      };
      // In dev/real mode, expose dev_code for local debugging
      if (SMS_MODE !== 'production' && isLocalRequest(req)) {
        response._dev_code = code;
      }
      return res.json(response);
    }

    // SMS not sent or failed
    if (SMS_MODE === 'production') {
      // Production: fail clearly — do NOT silently say "sent"
      return res.status(502).json({
        success: false,
        message: '短信发送失败，请稍后重试',
      });
    }

    // dev or real mode: return the code directly for development/testing
    // Security: only expose _dev_code to localhost requests (same gate as the
    // success branch above). Never leak the OTP to remote clients, even if the
    // SMS API failed in "real" mode — that would be account takeover.
    const response = {
      success: true,
      message: '验证码已发送',
      _expires_in: CODE_EXPIRY_MINUTES * 60,
      _warning: SMS_MODE === 'real'
        ? '阿里云短信发送失败（或AK/SK未配置），已降级为开发验证码'
        : '开发模式下直接显示验证码，不发送真实短信',
    };
    if (DEV_MODE && isLocalRequest(req)) {
      response._dev_code = code;
    }
    return res.json(response);
  } catch (err) {
    console.error('send-code error:', err);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: '请输入正确的手机号' });
    }

    if (!code || !/^\d{4}$/.test(code)) {
      return res.status(400).json({ success: false, message: '请输入4位验证码' });
    }

    // Rate limit: max 5 attempts per phone per minute
    if (!checkRateLimit(phone)) {
      return res.status(429).json({ success: false, message: '请求过于频繁，请稍后再试' });
    }

    const isValid = await verifyCode(phone, code);
    if (!isValid) {
      return res.status(401).json({ success: false, message: '验证码错误或已过期' });
    }

    const user = await findOrCreateUser(phone);

    const token = jwt.sign(
      { userId: user.id, phone: user.phone },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        expiresIn: JWT_EXPIRY,
        user: { id: user.id, phone: user.phone, nickname: user.nickname, avatar: user.avatar, email: user.email },
      },
    });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await getUser(req.user.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: '用户不存在' });
    }
    res.json({ success: true, data: { user } });
  } catch (err) {
    console.error('me error:', err);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});

// PUT /api/auth/profile — 更新昵称/头像
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { nickname, avatar } = req.body;
    const fields = {};
    if (nickname !== undefined) {
      const trimmed = nickname.trim();
      if (trimmed.length > 20) {
        return res.status(400).json({ success: false, message: '昵称不能超过20个字符' });
      }
      fields.nickname = trimmed;
    }
    if (avatar !== undefined) {
      if (avatar && !/^https?:\/\/.+/.test(avatar) && !avatar.startsWith('/') && !avatar.startsWith('data:image/')) {
        return res.status(400).json({ success: false, message: '头像地址格式不正确' });
      }
      fields.avatar = avatar;
    }

    const user = await updateUser(req.user.userId, fields);
    res.json({
      success: true,
      message: '个人资料已更新',
      data: { user: { id: user.id, phone: user.phone, nickname: user.nickname, avatar: user.avatar, email: user.email } },
    });
  } catch (err) {
    console.error('profile update error:', err);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});

// --- Email rate limiter (1 request per 60s per email) ---
const emailRateLimitMap = new Map();
const EMAIL_RATE_WINDOW_MS = 60_000;

function checkEmailRateLimit(email) {
  const now = Date.now();
  let entry = emailRateLimitMap.get(email);
  if (!entry || now - entry.windowStart > EMAIL_RATE_WINDOW_MS) {
    entry = { count: 0, windowStart: now };
    emailRateLimitMap.set(email, entry);
  }
  if (entry.count >= 1) return false;
  entry.count++;
  return true;
}

// POST /api/auth/send-email-code
router.post('/send-email-code', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: '请输入邮箱地址' });
    }

    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return res.status(400).json({ success: false, message: '邮箱格式不正确' });
    }

    if (!checkEmailRateLimit(normalized)) {
      return res.status(429).json({ success: false, message: '请求过于频繁，请 60 秒后再试' });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000;
    const createdAt = Date.now();

    // Invalidate any existing unused codes for this email
    await invalidateEmailCodes(normalized);

    // Save the new code
    await saveEmailCode(normalized, code, expiresAt, createdAt);

    console.log('[EMAIL] Sending verification code to:', normalized);

    // Send email (dev mode: console only, production: SMTP)
    await sendEmail(normalized, code);

    const response = {
      success: true,
      message: '验证码已发送',
      _expires_in: CODE_EXPIRY_MINUTES * 60,
    };
    if (DEV_MODE && isLocalRequest(req)) {
      response._dev_code = code;
    }
    return res.json(response);
  } catch (err) {
    console.error('send-email-code error:', err);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});

// POST /api/auth/bind-email (requires JWT)
router.post('/bind-email', requireAuth, async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, message: '邮箱和验证码不能为空' });
    }

    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return res.status(400).json({ success: false, message: '邮箱格式不正确' });
    }
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ success: false, message: '请输入6位验证码' });
    }

    const userId = req.user.userId;

    // Idempotent: already bound to this email → skip everything
    const currentUser = await getUser(userId);
    if (currentUser && currentUser.email === normalized) {
      return res.json({
        success: true,
        data: {
          user: { id: currentUser.id, phone: currentUser.phone, nickname: currentUser.nickname, avatar: currentUser.avatar, email: currentUser.email },
        },
      });
    }

    // 1. Look up the latest unused code
    const record = await getLatestUnusedCode(normalized);
    if (!record) {
      return res.status(400).json({ success: false, message: '验证码不存在，请重新获取' });
    }

    // 2. Check if already used
    if (record.used !== 0) {
      return res.status(400).json({ success: false, message: '验证码已使用，请重新获取' });
    }

    // 3. Check if expired
    if (Date.now() > record.expires_at) {
      return res.status(400).json({ success: false, message: '验证码已过期，请重新获取' });
    }

    // 4. Check code match
    if (record.code !== code) {
      return res.status(400).json({ success: false, message: '验证码错误' });
    }

    // 5. Atomic write: mark code used + check conflict + update email inside transaction
    let updatedUser;
    try {
      transaction(() => {
        // Mark code used (inside transaction — rolled back on any error)
        exec('UPDATE email_codes SET used = 1 WHERE id = ?', [record.id]);

        // Check if email already taken by another user
        const existing = queryOne('SELECT id FROM users WHERE email = ? AND id != ?', [normalized, userId]);
        if (existing) {
          throw new Error('该邮箱已被其他用户绑定');
        }

        // Update user email
        exec("UPDATE users SET email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [normalized, userId]);
      });
    } catch (txErr) {
      if (txErr.message === '该邮箱已被其他用户绑定') {
        return res.status(409).json({ success: false, message: txErr.message });
      }
      throw txErr;
    }

    // Fetch updated user for response
    updatedUser = await getUser(userId);
    res.json({
      success: true,
      message: '邮箱绑定成功',
      data: {
        user: { id: updatedUser.id, phone: updatedUser.phone, nickname: updatedUser.nickname, avatar: updatedUser.avatar, email: updatedUser.email },
      },
    });
  } catch (err) {
    console.error('bind-email error:', err);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});

// POST /api/auth/unbind-email (requires JWT)
router.post('/unbind-email', requireAuth, async (req, res) => {
  try {
    const user = await getUser(req.user.userId);
    if (!user.email) {
      return res.json({ success: true });
    }

    const updatedUser = await updateUserEmail(req.user.userId, null);
    res.json({
      success: true,
      message: '邮箱已解绑',
      data: {
        user: { id: updatedUser.id, phone: updatedUser.phone, nickname: updatedUser.nickname, avatar: updatedUser.avatar, email: updatedUser.email },
      },
    });
  } catch (err) {
    console.error('unbind-email error:', err);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});

module.exports = router;
