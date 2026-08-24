# JWT_SECRET 轮换 + 服务端重启 SOP

> 适用场景：JWT 签名密钥泄露、或定期安全轮换。本文档不记录任何真实密钥值。

## 为什么需要轮换

WristLab 的 JWT 签名密钥 `JWT_SECRET` 一旦进入 git 历史（哪怕只在未提交的文档里），拥有仓库读权限的人就能伪造任意用户 token。轮换 = 让所有已签发 token 立即失效 + 换用新密钥。

## 轮换流程

### 1. 生成强密钥

```bash
openssl rand -base64 48
```

生成 64 字符 base64 随机串。旧值曾是 30 位可读短语（弱熵），这是事故根因之一。

### 2. 更新 `.env`

`.env` 是 gitignore 的本地文件，真实密钥只存在这里：

```bash
# 用 sed 替换，注意 # 作分隔符（base64 密钥可能含 /）
sed -i 's#^JWT_SECRET=旧值#JWT_SECRET=新值#' .env
```

### 3. 脱敏仓库内所有真实密钥

```bash
# 全仓库扫描（排除 node_modules/.git 和本地 .env）
grep -rln "旧值\|新值" --exclude-dir=node_modules --exclude-dir=.git --exclude=.env .
```

任何命中都必须改占位符。**常见遗漏点：**
- `_knowledge/` 文档 — git 跟踪目录，最容易漏
- `.gstack/security-reports/*.json` — 安全审计报告会把密钥原文写进 findings，需一并脱敏

### 4. 防再犯（`.gitleaks.toml`）

项目根已配置 gitleaks（内置规则 + 自定义 `JWT_SECRET` 规则），.env/报告/包锁等豁免。本地检查：

```bash
gitleaks git --pre-commit   # 提交前扫描
```

## 服务端重启流程（关键）

**必须遵循「先确认端口释放，再启动」**，否则复现残留进程坑（见 `_knowledge/troubleshooting/stale-server-process-jwt.md`）。

```bash
# 1. 确认端口 3001 未被占用
netstat -ano | findstr :3001    # 无输出 = 已释放

# 2. 若有占用，杀进程
taskkill //F //PID <PID>

# 3. 再次确认释放
netstat -ano | findstr :3001    # 必须无输出

# 4. 启动
npm run server                  # 后台运行或另开终端
```

### ⚠️ 注意事项

1. **不要误杀无关 node 进程。** workbuddy 插件的微信支付 MCP server（node.exe）与项目无关，杀掉会破坏本地开发工具链。用 `tasklist //FI "IMAGENAME eq node.exe"` + `wmic`/PowerShell 查看 commandline 确认身份后再动手。
2. **旧 token 全部失效是预期行为。** 轮换后已登录会话收到 401「无效的登录凭证」，重新登录一次即可，不是 bug。
3. **dotenv 只在进程启动时读 .env** — 改了密钥必须重启服务端才生效。
4. **启动验证：** 日志出现 `WristLab API server running on http://localhost:3001`，再 `curl http://localhost:3001/api/health` 返回 `{"status":"ok"}`。

## 验证清单

- [ ] `.env` 已换新密钥，且全仓库 grep 无残留
- [ ] `node --check server/auth.cjs server/db.cjs` 通过
- [ ] `npm run server` 启动，端口 3001 监听，health 通过
- [ ] 前端重新登录成功，打卡/收藏等受保护 API 正常

## 相关链接

- `_knowledge/troubleshooting/stale-server-process-jwt.md` — 残留进程导致签名不匹配的踩坑记录
- `server/auth.cjs` — token 签发
- `server/middleware/auth.cjs` — token 验证
