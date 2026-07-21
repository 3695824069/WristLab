# Service Worker 缓存导致开发环境页面不更新

## 问题现象

修改代码后，刷新浏览器（包括新开标签页）仍然显示旧页面。
- Ctrl+Shift+R（硬刷新）可以显示最新版本
- 新标签页打开还是旧版本

## 根因

`public/sw.js` 中 JS/CSS 使用 `cacheFirst` 策略：

```js
if (request.destination === 'script' || request.destination === 'style') {
  event.respondWith(cacheFirst(request, STATIC_CACHE))
  return
}
```

Vite 开发服务器不产生文件 hash，URL 始终是 `/src/main.tsx`。Service Worker 命中了之前缓存的旧 JS，导致新代码不生效。

## 修复

### 1. 更改缓存策略

**JS/CSS**: `cacheFirst` → `networkFirst`

```js
// JS/CSS → Network First
if (request.destination === 'script' || request.destination === 'style' || /\.(js|css)$/i.test(url.pathname)) {
  event.respondWith(networkFirst(request))
  return
}
```

### 2. 升级缓存版本号

`wristlab-v1` → `wristlab-v2`，使旧缓存自动清空。

## 教训

- 开发环境 JS 文件无 hash → 不能用 cacheFirst
- 生产环境 Vite 产物带 hash（`index-D1YUIZAe.css`）→ cacheFirst 安全
- 混合模式需要考虑：一个 sw.js 同时服务 dev 和 prod
