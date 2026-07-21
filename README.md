# WristLab — 腕力训练教学平台

帮助新手和有一定基础的腕力爱好者系统学习训练。

## 技术栈

**前端**：React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS 3.4

**后端**：Express 5 + better-sqlite3 + JWT

**短信**：阿里云短信认证（dypnsapi），支持开发/真实/生产三模式

## 快速开始

```bash
# 安装依赖
npm install

# 启动后端（端口 3001）
npm run server

# 启动前端开发服务器（端口 5173）
npm run dev
```

## 开发模式

默认 `SMS_MODE=dev`，调用 `/api/auth/send-code` 返回测试验证码，不发送真实短信。

如需测试真实短信，在 `.env` 中配置阿里云密钥并设置 `SMS_MODE=real`。

## 项目结构

```
.
├── server/              # 后端
│   ├── index.cjs        # 入口
│   ├── db.cjs           # 数据库层（better-sqlite3）
│   ├── auth.cjs         # 鉴权路由
│   ├── workouts.cjs     # 训练路由
│   ├── favorites.cjs    # 收藏路由
│   ├── email.cjs        # 邮箱发送
│   └── migrations/      # 数据库迁移
├── src/                 # 前端
│   ├── pages/           # 页面组件
│   ├── components/      # 通用组件
│   ├── data/            # 静态数据
│   ├── hooks/           # 自定义 Hook
│   ├── context/         # React Context
│   └── lib/             # 工具函数
├── docs/                # 设计文档
│   ├── DATABASE.md      # 数据库设计
│   ├── migration/       # 迁移记录
│   ├── development/     # 开发配置
│   └── archive/         # 历史文档
└── public/images/       # 图片资源
```

## 页面

- `/` — 首页（今日推荐 + 热门课程）
- `/courses` — 课程列表
- `/courses/:id` — 课程详情
- `/exercises` — 动作库
- `/exercises/:id` — 动作详情
- `/plans` — 训练计划
- `/plans/:id` — 计划详情 + 打卡
- `/knowledge` — 知识库
- `/search` — 搜索
- `/profile` — 个人中心
- `/records` — 训练记录
- `/login` — 登录
