# WristLab — Claude Code 开发规则

> 本文件定义 Claude Code 在修改 WristLab 项目时必须遵守的最高优先级规则。

---

## 项目定位

腕力训练教学平台。前端优先，后端只做认证与用户数据。

**技术栈摘要：**
- 前端：React 19.2 + TypeScript 5.9 + Vite 7.2 + Tailwind CSS 3.4
- 后端：Express 5 + SQLite（better-sqlite3）+ JWT
- 部署：前端 → Cloudflare Pages，后端 → 独立 Node 平台

详细架构信息参见 `_knowledge/`。

---

## 修改流程（必须遵守）

1. **先输出计划** — 修改前列出文件清单和改动原因，等待确认
2. **最小修改** — 只改完成任务必需的代码，不顺带优化/重构
3. **局部范围** — 修改限制在指定文件内，不跨模块扩散
4. **单任务专注** — 一次只做一个任务，完成后才做下一个
5. **安全第一** — 不破坏已有 API 返回格式、数据库结构、前端功能

---

## 架构边界

### 设计原则
- 前端优先（先能跑，再优化）
- 后端只做认证与用户数据
- 禁止引入新依赖（除非明确批准）
- 禁止全局重构
- 禁止增加系统复杂度

### 数据流
- 课程/动作/计划/知识 → 前端 `src/data/*.ts` 静态文件
- 用户身份 + 行为 → 后端 SQLite + JWT
- 收藏 → localStorage 乐观更新 + 后端同步

---

## 前端约束

- 使用 React Router（`<Link>`、`useNavigate`），禁止原生 `<a href>` 或 `window.location.href`
- 禁止引入 Redux / Zustand 等状态库，保持 Context + useState + localStorage
- 禁止新增 Context Provider
- 页面组件通过 `React.lazy()` 懒加载

---

## 后端约束

- 不修改 API 返回格式
- 不修改鉴权逻辑
- 不修改 JWT payload
- 后端文件为 `.cjs`（CommonJS）

---

## 数据库约束

- 表结构变更**必须**通过 `server/migrations/` 迁移文件
- 禁止直接 inline `ALTER TABLE`
- 禁止修改 `server/fit_hub.db` 文件名
- 数据库引擎：better-sqlite3（WAL 模式）

---

## 验收要求

每次修改后必须验证：

1. `npx tsc --noEmit` 零错误
2. 功能符合任务描述
3. 未改动的文件保持原样
4. API 返回格式不变
5. 已有功能不退化

---

## Git 工作流

### 禁止操作（绝对不允许）
- `git reset --hard`
- `git push --force` 或 `git push -f`
- 修改历史提交（rebase / amend）
- 删除未提交文件
- 在未告知用户的情况下执行任何 git 写操作

### 修改流程（任务级，非每次编辑）
```
[领取任务] → 输出计划 → [用户确认] → 修改代码 → 测试验证 → 汇报结果 → [用户决定是否提交]
```

**说明：**
- 一次任务是一次完整的功能修改或修复，不是每改一行就停下来
- 任务完成后汇报：改了哪些文件、改了什么、测试是否通过
- 提交操作（commit/push）**始终由用户决定和执行**，我不主动执行

---

## 知识沉淀规则

### 必须记录到 `_knowledge/` 的场景
1. 改动项目整体架构、更换技术栈、调整数据库方案
2. 解决复杂、易复现、未来可能再次碰到的报错或环境问题
3. 完成技术选型、模块拆分、路由重构等重大功能调整
4. 总结可复用的开发模式或 SOP
5. 优化底层逻辑、修复生产级隐患

### 无需记录的场景
- 调整页面文字、按钮颜色、简单样式
- 仅修改变量名、注释、导入路径等微小优化
- 一次性临时调试

### 存放规则
- `_knowledge/architecture/` — 架构、数据库、前端设计
- `_knowledge/decisions/` — ADR 技术决策
- `_knowledge/troubleshooting/` — 报错、踩坑记录
- `_knowledge/lessons/` — 开发经验、SOP、部署方案
- `_knowledge/changelog/` — 迭代日志
