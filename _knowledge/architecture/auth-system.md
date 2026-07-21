# 认证系统

## 登录流程

```
用户输入手机号 → 请求验证码 → 输入验证码 → JWT 签发 → localStorage 存储
```

### 短信服务（SMS）

通过 Aliyun dypnsapi（短信认证产品）发送验证码。

**SMS_MODE 控制**（`.env` 配置）：

| 模式 | 行为 |
|------|------|
| `dev` | 不发送真实短信，验证码固定为 `_dev_code` |
| `real` | 调用 Aliyun API 发送，失败时降级到 `_dev_code` |
| `production` | 调用 Aliyun API 发送，失败则返回错误 |

#### 凭证配置

```
ALIYUN_ACCESS_KEY=LTAI5t7vqpW6PcEqMp6gwyqR
ALIYUN_ACCESS_SECRET=...
SMS_SIGN_NAME=WristLab
SMS_TEMPLATE_CODE=SMS_...
```

**注意**：RAM 子账号需要 `dypnsapi` 权限（与 dysmsapi 独立），如果缺少权限会返回 `Forbidden.NoPermission`。

### JWT

- 算法：HS256
- 过期：7 天
- 存储位置：`localStorage`（key: `fithub_auth`）
- Payload 包含：`userId`, `phone`

## 邮箱绑定

- 支持绑定/解绑邮箱
- 通过 nodemailer 发送验证码
- 迁移 001 添加 `users.email` 字段

## 认证边界

| 功能 | 需要登录 |
|------|---------|
| 浏览课程/动作/知识库 | ❌ |
| 收藏 | ✅ |
| 训练打卡 | ✅ |
| 训练记录 | ✅ |
| 个人主页 | ✅ |
