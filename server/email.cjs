const nodemailer = require('nodemailer');

const DEV_MODE = process.env.NODE_ENV !== 'production';

/**
 * 发送邮箱绑定验证码
 * 开发环境：仅 console.log，不实际发送
 * 生产环境：nodemailer SMTP 发送
 */
async function sendEmailCode(email, code) {
  if (DEV_MODE) {
    console.log(`[DEV] Email verification code for ${email}: ${code}`);
    return;
  }

  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const from = process.env.EMAIL_FROM || user;

  if (!host || !user || !pass) {
    console.warn('[EMAIL] SMTP not configured, skipping actual send');
    console.log(`[DEV] Email verification code for ${email}: ${code}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: email,
    subject: 'WristLab 邮箱绑定验证码',
    text: `您的 WristLab 邮箱绑定验证码为：${code}，有效期 5 分钟。如非本人操作，请忽略。`,
  });
}

module.exports = { sendEmailCode };
