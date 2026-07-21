# Cloudflare Pages 部署方案

## 架构

```
WristLab
├── 前端（SPA） → Cloudflare Pages
└── 后端（API） → VPS / Railway / Render / Fly.io
```

Cloudflare Pages **只能托管静态文件**。Express + better-sqlite3 后端需要单独部署到支持 Node.js 的平台。

## Cloudflare Pages 配置

| 字段 | 值 |
|------|-----|
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/`（留空） |

## 环境变量

在 CF Pages Dashboard → Settings → Environment Variables 设置：

| 变量 | 说明 |
|------|------|
| `VITE_API_BASE` | 后端 API 地址（如 `https://api.wristlab.com`） |

## SPA 路由

`public/_redirects` 已配置：

```
/*    /index.html   200
```

确保 `/about`、`/contact` 等 Vue/React 路由直接访问时不返回 404。

## 部署流程

1. 后端部署到独立平台（见下方）
2. CF Pages 连接 GitHub 仓库
3. 设置环境变量 `VITE_API_BASE`
4. 设置分支（main）
5. 自动部署

## 后端部署参考

后端要求 Node.js + SQLite（better-sqlite3），推荐平台：

| 平台 | 说明 |
|------|------|
| Railway | 一键部署，自带 SQLite 支持 |
| Render | Web Service + 盘片持久化 |
| Fly.io | 全球边缘，需配置卷 |
| VPS | 完全控制 |

后端启动命令：

```bash
node server/index.cjs
```

端口通过 `PORT` 环境变量配置（默认 3001）。
