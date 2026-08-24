# 残留服务端进程导致 JWT 签名不匹配

## 故障现象

登录成功（验证码通过），但所有需要认证的 API 均返回「无效的登录凭证」：

- 21 天训练计划 → 完成训练 → 401
- 收藏动作 → 401

重新登录无效。多个页面同时出现，说明是认证链路全局问题，而非单个页面逻辑错误。

## 原因

**两个不同进程使用了不同的 JWT_SECRET 来签发和验证 token。**

| 进程 | 角色 | JWT_SECRET | 状态 |
|------|------|------------|------|
| 旧进程（PID 28396） | 实际监听端口 3001 | `crypto.randomBytes(32)` ← 每次启动随机 | ❌ 活着的残留 |
| 新进程 | 处理登录请求 | `JWT_SECRET` ← `.env` 固定值（随机强密钥） | ✅ |

关键链路：

1. 用户打开浏览器 → 登录 → 请求到达**新进程** → token 用固定 secret 签发
2. 后续 API 请求 → 到达**监控端口 3001 的旧进程** → 用随机 secret 验证 → 签名不匹配 → 「无效的登录凭证」

### 为什么旧进程还活着

之前排查时曾 `kill` 过部分 node 进程，但**没有确认端口 3001 是否真的释放**。旧进程（PID 28396）一直活着，持续的 API 请求都被它拦截。

`:3001` 上只会有一个进程监听成功，谁先启动谁占住。旧进程先启动，之后所有新启动的服务端进程都在启动后立即退出（端口被占），表面上看重启成功了，实际上处理的请求全部被旧进程吃掉。

## 复现条件

- `.env` 配置了固定 `JWT_SECRET`
- 但在设置固定 `JWT_SECRET` **之前**已经启动过服务端进程
- 后续用了 `kill` + `node server/index.cjs` 重启，但没有检查端口是否真正释放

## 解决

```bash
# 1. 找到占用端口 3001 的进程
netstat -ano | findstr :3001

# 2. 杀掉
taskkill //F //PID <进程ID>

# 3. 确认端口已释放
netstat -ano | findstr :3001    # 没有任何输出

# 4. 重新启动
node server/index.cjs
```

也可以直接杀所有 node 进程：

```bash
taskkill //F //IM node.exe
```

但这会导致前端 Vite 进程也被杀掉，需要重新执行 `npx vite`。

## 预防

### 方案 A：强制 JWT_SECRET 必须设置（推荐）

在 `server/index.cjs` 或 `server/auth.cjs` 启动时检查：

```javascript
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET 未设置，请在 .env 中配置');
  process.exit(1);
}
```

这样即使启动旧进程也会立刻退出，不会残留。

### 方案 B：kill 后确认端口

每次重启时用 `netstat` 或 `lsof` 确认端口 3001 已释放，而不是只看进程 PID。

## 相关文件

- `server/index.cjs` — dotenv 加载 + server 启动
- `server/auth.cjs` — token 签发（第 51 行 `JWT_SECRET` 读取）
- `server/middleware/auth.cjs` — token 验证（第 4 行 `JWT_SECRET` 读取）
- `.env` — `JWT_SECRET=<随机强密钥>`（出于安全原因，文档中不记录真实值）
