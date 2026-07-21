# ADR: 短信 API 从 dysmsapi 迁移到 dypnsapi

## 背景

原项目使用阿里云 dysmsapi（标准短信发送 API）发送验证码。后因业务策略调整，需要切换到 dypnsapi（短信认证产品）以使用专门的验证码模板。

## 迁移内容

| 项目 | 旧 | 新 |
|------|----|----|
| API | dysmsapi（标准短信） | dypnsapi（短信认证） |
| 签名算法 | 不变（HMAC-SHA1） | 不变 |
| 产品名 | Dysmsapi | Dypnsapi |
| 模板方式 | 标准短信模板 | 短信认证模板（SendSmsVerifyCode） |

## 关键风险

### RAM 权限分离

dypnsapi 和 dysmsapi 在阿里云 RAM 中是**两个独立的产品权限**。即使子账号有 dysmsapi 权限，也不能调用 dypnsapi。

```
子账号权限集无 dypnsapi → Forbidden.NoPermission
```

### 降级策略

当 `SMS_MODE=real` 且 API 调用失败时，系统不会直接拒绝登录，而是降级输出 `_dev_code`，确保开发测试不阻塞。

## 教训

- RAM 权限需要单独配置，不能假设一个产品权限覆盖所有
- `SMS_MODE=real` 模式下失败有降级，而 `production` 模式则严格报错
