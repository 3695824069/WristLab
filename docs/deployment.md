# WristLab Deployment Guide

> 本文档适用于开发者或 AI Agent 从头部署 WristLab 项目。

---

## 1. 项目结构

```
fit-hub/
├── src/                  # React 前端源码（TypeScript + JSX）
├── public/
│   └── _redirects        # Cloudflare Pages SPA 路由回退规则
├── server/               # Express 后端（CommonJS, .cjs）
├── dist/                 # 构建产物（Vite 输出）
├── docs/                 # 项目文档
├── _knowledge/           # 开发知识沉淀
├── .github/
│   └── workflows/
│       └── ci.yml        # GitHub Actions CI pipeline
├── .github/
│   └── pull_request_template.md
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── .prettierrc
└── .prettierignore
```

**技术栈：**

| 层 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript 5.9 |
| 构建工具 | Vite 7 |
| 样式 | Tailwind CSS 3.4 |
| 测试 | Vitest + React Testing Library |
| 代码规范 | ESLint 9 + Prettier |
| 后端 | Express 5 + better-sqlite3 + JWT |
| 前端托管 | Cloudflare Pages |
| CI | GitHub Actions |

**部署架构：**

```
用户浏览器
    ↓
Cloudflare Pages（托管前端 SPA）
    ↓  API 请求
Express 后端（独立 Node 平台，承载 SQLite + JWT）
```

前端是单页应用（SPA），所有路由在 Cloudflare Pages 上通过 `_redirects` 回退到 `index.html`。后端需要单独部署到一个支持 Node.js + SQLite 的平台。

---

## 2. Cloudflare Pages 配置

### 在 Cloudflare Dashboard 中设置

| 字段 | 值 |
|------|-----|
| Framework preset | Vite（或 None） |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/`（留空） |
| Node.js version | 22 |

### SPA 路由

`public/_redirects` 已配置：

```
/*    /index.html   200
```

确保 `/about`、`/contact`、`/courses` 等 React Router 路由在直接访问时不返回 404。Cloudflare Pages 会自动读取此文件。

### 部署触发方式

- **自动（推荐）**：Cloudflare Pages 连接 GitHub 仓库，监听 `main` 分支。每次 push 到 `main` 自动构建部署。
- **手动**：在 Cloudflare Dashboard 中点击 "Deploy" 或使用 Wrangler CLI。

### 连接 GitHub 仓库

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages
2. 点击 **Create** → **Connect to Git**
3. 授权 GitHub，选择 `3695824069/WristLab`
4. 配置 Build settings（见上表）
5. 设置环境变量（见第 3 节）
6. 点击 **Save and Deploy**

---

## 3. 环境变量

### VITE_API_BASE

| 属性 | 值 |
|------|-----|
| 变量名 | `VITE_API_BASE` |
| 用途 | 前端请求后端 API 的基地址 |
| 默认值 | `http://localhost:3001/api`（开发环境） |
| 生产环境 | `https://your-api-domain.com/api` |

**设置位置：**
- **Cloudflare Pages**：Dashboard → Pages → WristLab → Settings → Environment Variables → 添加 `VITE_API_BASE`
- **本地开发**：项目根目录创建 `.env` 文件

```
VITE_API_BASE=http://localhost:3001/api
```

> Vite 环境变量必须以 `VITE_` 前缀开头才会暴露给前端代码。

---

## 4. 本地开发

### 前置条件

- Node.js 22+
- npm

### 步骤

```bash
# 1. 克隆仓库
git clone https://github.com/3695824069/WristLab.git
cd WristLab

# 2. 安装依赖
npm install

# 3. 启动前端开发服务器（热更新）
npm run dev

# 4. （可选）启动后端服务器
npm run server
```

### 可用命令

| 命令 | 用途 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器（默认 5173） |
| `npm run build` | TypeScript 检查 + Vite 生产构建 |
| `npm run preview` | 预览构建产物 |
| `npm run server` | 启动 Express 后端（默认 3001） |
| `npm run lint` | ESLint 检查 |
| `npm run lint:fix` | ESLint 自动修复 |
| `npm run format` | Prettier 格式检查 |
| `npm run format:fix` | Prettier 自动格式化 |
| `npm run test` | 运行 Vitest 测试 |
| `npm run test:watch` | 监听模式运行测试 |
| `npm run test:coverage` | 运行测试并生成覆盖率报告 |

### 本地完整测试（提交前检查）

```bash
npm run lint      # 代码规范
npx tsc --noEmit  # 类型检查
npm run test      # 单元测试
npm run build     # 构建验证
```

---

## 5. CI/CD 流程

### 流程图

```
Developer push / PR
       ↓
   GitHub
       ↓
GitHub Actions CI
  ├── TypeScript check（tsc --noEmit）
  ├── Format check（prettier --check）
  ├── Lint（eslint）
  ├── Test（vitest run）
  └── Build（tsc -b && vite build）
       ↓
  ✅ CI 通过 → 合并到 main
       ↓
Cloudflare Pages
  ├── npm run build
  └── 部署 dist/ 到生产环境
```

### 触发条件

`.github/workflows/ci.yml` 定义：

```yaml
on:
  push:
    branches: [main]      # 直接 push main → 运行 CI
  pull_request:
    branches: [main]      # PR 到 main → 运行 CI
```

### 开发分支策略

```
main ─────── 生产部署分支
   │
   └── feature/* ─── 功能开发分支
         │
         └── Pull Request → main（触发 CI 检查）
```

**流程：**
1. 从 `main` 创建 `feature/xxx` 分支
2. 在 feature 分支上开发
3. 创建 Pull Request → `main`
4. CI 自动检查（TypeScript + Lint + Test + Build）
5. 通过后合并到 `main`
6. Cloudflare Pages 自动部署

---

## 6. 常见问题

### 6.1 build 失败

**现象：**
```
npm run build
> tsc -b && vite build
error TS2322: Type 'X' is not assignable to type 'Y'
```

**原因：** TypeScript 类型错误。

**解决：**
- 修复类型错误
- 运行 `npx tsc --noEmit` 本地检查
- 确保 Vite 和 TypeScript 版本兼容

**现象：**
```
[vite] Internal server error: Plugin "vite:vue" conflic
```

**原因：** 项目使用 React，但插入了 Vue 相关配置。

**解决：** `vite.config.ts` 只使用 `@vitejs/plugin-react`。

### 6.2 环境变量错误

**现象：**
```
前端页面空白 / API 请求全部失败
浏览器 Console: Failed to fetch / 401 Unauthorized
```

**原因：** `VITE_API_BASE` 未设置或指向了错误的后端地址。

**解决：**
1. 确认 Cloudflare Pages Dashboard → Environment Variables 中设置了 `VITE_API_BASE`
2. 确认后端服务已启动并且网络可达
3. 本地开发检查 `.env` 文件是否存在
4. 重新部署使环境变量生效

### 6.3 Cloudflare 没有触发部署

**现象：**
- GitHub 显示了新的 commit，但 Cloudflare Pages 没有自动构建
- 线上仍然是旧版本

**原因与解决：**

| 原因 | 解决 |
|------|------|
| 推送到了非 main 分支 | 创建 PR 合并到 main，或手动在 Cloudflare 选择分支部署 |
| GitHub 与 Cloudflare 集成断连 | 在 Cloudflare Dashboard → Pages → WristLab → Settings 重新连接 GitHub |
| Cloudflare 构建队列积压 | 等待或手动触发部署（Dashboard → Deploy → Trigger deploy） |
| 已有相同 commit hash 的部署 | 推送一个新的空 commit：`git commit --allow-empty -m "trigger deploy" && git push` |

### 6.4 部署后页面白屏

**现象：**
- 部署成功（绿色勾）
- 访问网站显示空白页

**原因：**
- `_redirects` 文件未正确部署（检查 `dist/_redirects` 是否存在）
- 环境变量未生效（Redeploy 即可）
- 构建时 JS 运行时错误（查看浏览器 Console）

**解决：**
1. 确认 `npm run build` 后 `dist/` 目录有 `_redirects` 文件
2. 检查 Cloudflare Pages 构建日志是否有错误
3. 查看浏览器开发者工具 Console 和 Network 面板

### 6.5 后端部署参考

后端（Express + better-sqlite3）不在 Cloudflare Pages 范围内，需要单独部署：

| 平台 | 说明 |
|------|------|
| Railway | 一键部署，支持 SQLite |
| Render | Web Service + 持久化磁盘 |
| Fly.io | 全球边缘部署，需配置卷 |
| VPS | 完全控制 |

后端启动命令：

```bash
node server/index.cjs
```

端口通过 `PORT` 环境变量配置（默认 3001）。

---

## 7. 相关文档

- [数据库文档](DATABASE.md)
- [Cloudflare Pages 部署方案](../_knowledge/lessons/cloudflare-pages-deployment.md)
- [开发知识沉淀](../_knowledge/)
