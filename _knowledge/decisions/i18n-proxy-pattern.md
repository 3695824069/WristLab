# ADR: i18n 响应式标签使用 Proxy 模式

## 问题

课程分类标签（如 `fat_loss` → `减脂`）需要在语言切换时实时更新。如果用普通对象在模块加载时调用 `i18n.t()`，值被固化，切换语言后标签不更新。

## 方案对比

### ❌ 方案 A：普通对象（固化翻译）

```ts
export const courseCategoryLabels = {
  fat_loss: i18n.t('courses.category_fat_loss'),
}
// 切换语言后 → 不更新
```

### ❌ 方案 B：每次渲染时调用

```tsx
// 每个使用处都要写，容易遗漏
{t('courses.category_fat_loss')}
```

### ✅ 方案 C：Proxy 对象（最终选择）

```ts
function createI18nRecord<T extends string>(keyMap: Record<T, string>): Record<T, string> {
  return new Proxy({} as Record<T, string>, {
    get: (_, prop) => {
      const key = keyMap[prop as T]
      return key ? i18n.t(key) : String(prop)
    },
  })
}
```

## 工作原理

1. `createI18nRecord()` 返回一个 Proxy
2. 每次属性访问（`courseCategoryLabels['fat_loss']`）触发 `get` 拦截
3. `get` 内部调用 `i18n.t(key)` 获取当前语言的翻译
4. 组件重新渲染时，`useTranslation()` 的 `t` 已更新，Proxy 返回新值

## 收益

- 语法兼容：`courseCategoryLabels[cat]` 保持合法
- 切换语言后所有标签自动更新
- 零额外渲染开销
- 一处定义，处处使用

## 适用范围

- `courseCategoryLabels` — 课程分类
- `exerciseCategoryLabels` — 动作部位
- `difficultyLabels` — 难度等级
- `knowledgeCategoryLabels` — 知识库分类
