# WristLab — 腕力训练教学平台

> 📌 **开发规则**：本文件定义 WristLab 项目的技术栈、架构约束和修改规范。

---

## 技术栈
### 前端
- React 19.2 + TypeScript 5.9 + Vite 7.2
- Tailwind CSS 3.4（暗色主题）
- react-router-dom 7.14
- shadcn/ui（Radix + CVA）
- Recharts 2.15 / react-hook-form + zod / sonner / lucide-react
### 后端（server/）
- Node.js + Express 5
- SQLite（better-sqlite3，原生绑定）
- JWT（jsonwebtoken，7d 过期）
- 阿里云短信 API（dypnsapi SendSmsVerifyCode）
- nodemailer（邮箱绑定）
- dotenv
### 核心配置
- `.env` 在根目录，受 `.gitignore` 保护
- `SMS_MODE=dev|real|production` 控制短信行为
- server 入口：`server/index.cjs`
- DB 文件：`server/fit_hub.db`
---
## 项目现状
### 已完成功能
- 手机号验证码登录（完整链路）
- JWT 鉴权（7d，HS256）
- 收藏系统（localStorage + 后端同步，乐观更新）
- 搜索系统（localStorage 历史 + 拼音分词）
- 课程/动作/计划静态数据
- 知识库文章
- 邮箱绑定/解绑
- 训练打卡（workout_records）
- 动作级训练记录（workout_exercise_records V1）
- 训练统计（总次数/连续打卡/本周次数）
- 今日推荐训练
- 图片资源（18 张）
- React.lazy 代码分割
- 图片懒加载
- MediaCard 通用卡片组件
### 未完成
- 微信登录（仅 UI）
- 视频嵌入（所有 videoUrl 已配 Bilibili 链接，VideoModal 可播放）
- 个人资料编辑增强
- 训练记录 V2（组数/重量/RPE）
### 已知问题
- 视频组件 VideoPlayer 和 VideoModal 有功能重叠

---
## 页面结构

```
/            Home
/courses     课程列表
/courses/:id 课程详情
/exercises   动作库
/exercises/:id 动作详情
/plans       训练计划
/plans/:id   计划详情
/knowledge   知识库
/knowledge/:id 文章详情
/login       登录
/search      搜索
/profile     个人中心
/records     训练记录
```
---
## 数据结构
### 后端数据库（SQLite，7 表）
- `users` — 用户（phone / nickname / avatar / email）
- `sms_codes` — 短信验证码
- `email_codes` — 邮箱验证码
- `workout_records` — 打卡记录
- `workout_exercise_records` — 动作级记录（V1）
- `favorites` — 收藏
- `schema_versions` — Migration 版本
详见 [docs/DATABASE.md](docs/DATABASE.md)
### 前端静态数据
- `courses.ts`（21）
- `exercises.ts`（30）
- `plans.ts`（3）
- `knowledge.ts`（文章）
### localStorage
- `fithub_auth` — 登录 token
- `favorites_{userId}` — 收藏缓存
- `fithub_search_history_v2` — 搜索历史
---
## 核心架构
### 数据流
- 静态课程/动作/计划 → 前端 TS 文件
- 用户身份 → JWT + SQLite
- 用户行为（收藏/打卡）→ 后端同步 + localStorage 乐观更新
### 设计原则
- 前端优先（先能跑，再优化）
- 后端只做认证与用户数据
- 禁止引入新依赖（除非明确批准）
- 禁止全局重构
- 禁止增加系统复杂度
---
## 修改规范
### 必须遵守
1. **先输出计划** — 修改代码前列出文件清单和改动原因
2. **最小修改** — 只改完成任务必需的代码，不顺带优化/重构
3. **局部范围** — 修改限制在指定文件内，不跨模块扩散
4. **单任务专注** — 一次只做一个任务，完成后才做下一个
5. **安全第一** — 不破坏已有 API 返回格式、数据库结构、前端功能
### 前端约束
- 使用 React Router（`<Link>`、`useNavigate`），禁止原生 `<a href>` 或 `window.location.href`
- 禁止引入 Redux / Zustand 等状态库，保持 Context + useState + localStorage
- 禁止新增 Context Provider
### 后端约束
- 不修改 API 返回格式
- 不修改鉴权逻辑
- 不修改 JWT payload
### 数据库约束
- 表结构变更**必须**通过 `server/migrations/` 迁移文件
- 禁止直接 inline `ALTER TABLE`
- 禁止修改 `server/fit_hub.db` 文件名
### 验收要求
每次修改后必须验证：
1. `npx tsc --noEmit` 零错误
2. 功能符合任务描述
3. 未改动的文件保持原样
4. API 返回格式不变
5. 已有功能不退化
# 知识沉淀强制规则
## 一、触发生成文档的场景（满足任意一条必须输出md文件到/_knowledge对应文件夹）
1. 改动项目整体架构、更换技术栈、调整数据库方案
2. 解决复杂、易复现、未来大概率再次碰到的报错/并发/环境问题
3. 完成技术选型、模块拆分、路由重构等重大功能调整
4. 总结可复用的开发模式、Agent操作流程、标准化SOP
5. 优化底层逻辑、修复生产级隐患

## 二、无需生成文档的场景（轻量化修改跳过记录）
1. 调整页面文字、按钮颜色、简单样式
2. 仅修改变量名、注释、导入路径等微小代码优化
3. 一次性临时调试、测试数据改动

## 三、统一文档模板（所有生成文件严格遵循）
# 【文档标题】
## 背景
当前项目现状、本次改动的起因、需求来源
## 问题
需要解决的核心矛盾、故障现象、架构短板
## 根因分析
底层产生问题/需求的根本原因
## 最终解决方案
完整可复现操作、代码改动要点、配置调整
## 风险与后续注意事项
上线隐患、后续维护限制、兼容性问题
## 关联文件
列出本次修改涉及的src内代码路径

## 四、存放目录匹配规则
- architecture/：系统架构、数据库、底层模块设计
- decisions/：技术选型、架构变更ADR决策记录
- troubleshooting/：报错、并发、环境、第三方库踩坑
- lessons/：Claude Agent使用技巧、开发规范、复用代码范式
- changelog/：大型版本迭代整体开发日志