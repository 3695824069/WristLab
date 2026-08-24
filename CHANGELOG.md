# Changelog

> 本项目遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。
>
> 格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/)。

---

## [0.2.0] — 2026-07-25

### Added
- ESLint + Prettier 代码规范（eslint.config.mjs, .prettierrc）
- Vitest 测试框架（3 个测试文件，57 个测试用例）
- GitHub Actions CI pipeline（type-check → format → lint → test → build）
- Dependabot 自动依赖安全更新（每周一检查）
- Pull Request 模板（.github/pull_request_template.md）
- 部署文档（docs/deployment.md）

### Changed
- 搜索函数提取到独立模块（src/lib/search-utils.tsx）

### Fixed
- package.json 从 Codex Electron 覆盖中恢复（git checkout f21e0aa）
- 所有 `err: any` → `unknown`（类型安全 error handling）
- ESLint 23 个 no-explicit-any 错误归零
- npx tsc --noEmit 零错误

### Infrastructure
- 分支策略：main（生产） + feature/*（功能开发）
- Cloudflare Pages 自动部署（监听 main 分支）

---

## [0.1.0] — 2026-07-20

### Added
- 腕力训练教学平台完整前端
- 手机号验证码登录（完整链路）
- JWT 鉴权（7d, HS256）
- 收藏系统（localStorage + 后端同步，乐观更新）
- 搜索系统（localStorage 历史 + 拼音分词）
- 课程 / 动作 / 计划 / 知识库静态数据
- 邮箱绑定 / 解绑
- 训练打卡 + 动作级训练记录
- 训练统计（总次数 / 连续打卡 / 本周次数）
- 今日推荐训练
- i18n 国际化（中英文完整覆盖）
- About 页面、Contact 页面
- React.lazy 代码分割 + 图片懒加载

### Infrastructure
- Git 初始化并推送至 GitHub（github.com/3695824069/WristLab）
- Cloudflare Pages 部署配置（_redirects SPA fallback）
- Service Worker 缓存策略（networkFirst）
