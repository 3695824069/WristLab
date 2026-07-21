# SPA 路由切换后滚动位置异常

## 问题现象

从首页底部模块点击进入详情页后，页面没有从顶部开始，而是直接定位到页面中间或靠下位置。

例如：首页 → 「腕力比赛规则和安全」→ 直接看到介绍文字区域，需要手动向上滚动才能看到封面/视频。

## 根因

React Router 路由切换时**不自动重置滚动位置**。SPA 的特点是页面不刷新，浏览器不会像传统页面跳转那样自动 `scrollTo(0,0)`。

当用户从首页底部（滚动过的位置）点击 Link 进入新页面时，浏览器保留了之前的滚动偏移。

## 修复方案

### 全局 ScrollToTop 组件

```tsx
// src/components/ScrollToTop.tsx
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}
```

在 `App.tsx` 的 `<Routes>` 上方渲染，所有路由共享。

### 为什么不在每个页面单独处理

- 避免重复代码
- 防止遗漏新页面
- 统一行为

## 注意

- `behavior: 'instant'` 比 `'smooth'` 更合适，防止用户感知到滚动动画
- 放在 `<Navbar />` 后面，不影响导航栏自身布局
