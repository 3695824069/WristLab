# 短信认证（dypnsapi）配置踩坑

## 故障现象

手机收不到验证码，但前端显示「验证码已发送」。

## 原因

两个问题叠加：

### 1. 签名配置错误

`SendSmsVerifyCode` 接口不再支持自定义签名，必须使用**系统赠送签名**。

```
SMS_SIGN_NAME=速通互联验证码    ← ❌ 自定义签名，API 拒绝
SMS_SIGN_NAME=恒创联众           ← ✅ 系统赠送签名
```

### 2. SMS_MODE=real 的静默降级

`server/auth.cjs` 的 SMS_MODE 逻辑：

| 模式 | SMS 失败时行为 |
|------|--------------|
| `dev` | 不调 API，直接返回 `_dev_code` |
| `real` | 调 API → 失败 → **静默降级**返回 `_dev_code`（不报错） |
| `production` | 调 API → 失败 → 返回 502 错误 |

`real` 模式在签名出错时掩盖了问题：用户看到「验证码已发送」，实际短信从未发出。

## 解决

1. **确认系统赠送签名** — [号码认证控制台](https://dypns.console.aliyun.com/) → 赠送签名配置页面
2. **`.env` 改两处**：
   - `SMS_SIGN_NAME=恒创联众`
   - `SMS_MODE=production`
3. **`server/auth.cjs` 补全参数**（`sendSms()` 中）：
   ```javascript
   CodeType: 1,           // 纯数字验证码
   ReturnVerifyCode: true, // 返回验证码便于调试
   ```

## 相关文件

- `server/auth.cjs` — `sendSms()` + `/send-code` 路由
- `.env` — 本地配置
- `.env.example` — 提交到 git 的模板
