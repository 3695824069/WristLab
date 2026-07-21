# 前端架构

## 技术栈

- **框架**: React 19.2 + TypeScript 5.9
- **构建**: Vite 7.2
- **样式**: Tailwind CSS 3.4（暗色主题）
- **路由**: react-router-dom 7.14
- **国际化**: react-i18next + i18next
- **图表**: Recharts 2.15
- **表单**: react-hook-form + zod
- **Toast**: sonner
- **图标**: lucide-react
- **UI**: shadcn/ui（Radix + CVA）

## 目录结构

```
src/
├── components/      # 通用组件（Navbar, Footer, VideoPlayer, etc.）
├── pages/           # 页面组件（按路由划分）
├── hooks/           # 自定义 Hooks（useFavorites）
├── context/         # React Context（AuthContext）
├── lib/             # 工具函数（api.ts 网络请求）
├── data/            # 静态数据（courses, exercises, plans, knowledge）
├── types/           # TypeScript 类型定义 + i18n Proxy
├── i18n/            # 国际化配置 + 语言包
│   └── locales/
│       ├── zh-CN.json  (427行)
│       └── en-US.json  (427行)
```

## 核心设计决策

### 1. 数据分层

| 数据类型 | 存储位置 | 说明 |
|---------|---------|------|
| 课程/动作/计划/知识库 | `src/data/*.ts` | 静态 TS 文件，不经过后端 |
| 用户身份 | SQLite + JWT | 后端认证 |
| 收藏 | localStorage + 后端同步 | 乐观更新 |
| 训练记录 | SQLite | 后端 workout_records |

### 2. 路由（14 个页面）

```
/                    Home
/courses             课程列表
/courses/:id        课程详情
/exercises           动作库
/exercises/:id      动作详情
/plans               训练计划
/plans/:id          计划详情
/knowledge          知识库
/knowledge/:id      文章详情
/login               登录
/search              搜索
/profile             个人中心
/records            训练记录
/about              关于
/contact            联系我们
```

### 3. 页面懒加载

所有页面通过 `React.lazy()` 实现代码分割，配合 `<Suspense>` 展示加载状态。

### 4. 全局组件布局

```
<BrowserRouter>
  <AuthProvider>
    <Navbar />           # 顶端导航 + LanguageSwitcher
    <ScrollToTop />      # 路由切换自动滚到顶部
    <Routes>...</Routes> # 懒加载页面
    <Footer />           # 全站底部
    <Toaster />          # Toast 通知
  </AuthProvider>
</BrowserRouter>
```

### 5. 状态管理

- 无 Redux / Zustand
- Context（AuthContext）+ useState + localStorage
- 收藏数据：乐观更新（先改本地，再同步后端）

## 关键模式

### createI18nRecord — 响应式 i18n 标签

用 Proxy 包装分类标签对象，每次属性访问实时从 i18n 获取翻译，组件切换语言时自动更新：

```ts
export const courseCategoryLabels = createI18nRecord({
  fat_loss: 'courses.category_fat_loss',
  // ...
})
```

### Service Worker

PWA 支持，`public/sw.js` 管理缓存策略：
- JS/CSS: Network First（开发模式确保最新）
- 图片: Cache First
- API: Network First
- 导航: Network First with offline fallback
