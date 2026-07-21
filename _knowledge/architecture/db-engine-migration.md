# 数据库引擎迁移：sql.js (WASM) → better-sqlite3

## 背景

项目最初使用 **sql.js**（SQLite 的 WebAssembly 实现）作为数据库引擎。后迁移到 **better-sqlite3**（Node.js 原生 C 扩展）。

## 迁移原因

| 项 | sql.js | better-sqlite3 |
|----|--------|----------------|
| 运行方式 | WASM 虚拟机 | Native C addon |
| API | 异步（手动 save） | 同步（即时写入） |
| 持久化 | 手动 `saveDb()` 写文件 | 自动 WAL 文件 |
| 并发 | 单进程锁 | 原生 SQLite 锁 |
| 性能 | ~5x 慢 | 原生速度 |

## 遗留问题

迁移后留下的向后兼容代码：

```js
// server/db.cjs — 以下函数现在是空壳
function saveDb() { /* 之前触发 sql.js 写盘，现在 better-sqlite3 自动处理 */ }
function scheduleSave() { /* 同上，定时防抖写盘 */ }
```

这些函数保留未删除，避免调用了它们的模块报错。后续清理时可以移除。

## 文件变更

- `server/db.cjs` — 替换引擎核心
- `package.json` — 依赖从 `sql.js` 改为 `better-sqlite3`
- `server/migrations/` — 迁移框架统一
