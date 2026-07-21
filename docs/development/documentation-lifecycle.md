# WristLab 文档生命周期管理规范

> 生效日期：2026-07-16
> 适用范围：根目录、docs/、server/、scripts/ 及项目内所有文档文件

---

## 核心原则

**Documentation should describe the project, not the development process.**

长期维护项目文档，不要长期保存一次性分析、调试或实施报告。

---

## 第一阶段：每次任务完成后自动扫描

扫描范围：

- 根目录
- docs/
- server/
- scripts/

检查文件类型：

- `*.md`
- `*.log`
- `*.txt`
- `*.bak`
- `*.tmp`

分类：

| 类别 | 说明 | 示例 |
|------|------|------|
| **A. 永久文档** | 描述项目本身，长期有效 | README.md, CLAUDE.md, DATABASE.md, ARCHITECTURE.md |
| **B. 长期记录** | 重大架构变更、重要决策 | 数据库迁移记录、ADR |
| **C. 一次性分析** | 任务完成即过期 | `*-analysis.md`, `*-audit.md`, `*-debug.md` |
| **D. 实施报告** | 普通功能实施后即过期 | `*-implementation-report.md`, `*-migration-report.md` |
| **E. 临时文件** | 运行时或调试产生 | server.log, test_*.txt, *.bak, *.tmp |

---

## 第二阶段：处理规则

### A. 永久文档

- 保留原位置
- 内容变化时更新原文件
- **禁止**创建 `_v2`, `_NEW`, `_FINAL` 等版本副本

### B. 长期记录

- 保留
- 移动到 `docs/history/` 或 `docs/adr/`
- 按时间整理命名

### C. 一次性分析

- 任务完成后 **立即删除**
- 不要提交 Git

### D. 实施报告

- 普通功能 → **删除**
- 重大架构升级 → 保留并移动到 `docs/history/`

### E. 临时文件

- **立即删除**
- 包括：server.log, *.tmp, *.bak, test_*.txt, debug.log

---

## 第三阶段：目录规范

```
docs/
├── architecture/     # 永久设计文档（DATABASE.md 等）
├── history/          # 长期记录（重大变更、ADR）
└── development/      # 开发规范、规则类文档
```

禁止：
```
docs/
├── analysis1.md        ← 禁止
├── analysis2.md        ← 禁止
├── report3.md          ← 禁止
└── report_final.md     ← 禁止
```

---

## 第四阶段：品牌统一

每次提交前检查 FitHub / WristLab 是否混用。

- 用户可见名称统一为 **WristLab**
- **不要误改**：数据库文件名、数据库表名、API 路径、localStorage key

---

## 第五阶段：提交前检查

检查是否存在：

- `*-analysis.md`
- `*-audit.md`
- `*-debug.md`
- `server.log`
- `*.bak`
- `*.tmp`

对以上文件：

1. 输出建议删除列表
2. 等待确认后执行
3. 不要未经确认直接删除

---

## 第六阶段：安全原则

整理项目时 **禁止** 修改：

- 业务逻辑
- 数据库
- API
- 前端功能

只允许：

- 移动文件
- 删除文件
- 归档文件
- 更新文档内容

---

## 第七阶段：回滚保障

所有删除操作必须可确认、可回滚。

- 删除前输出清单
- 等待确认
- 确认后执行
- 如误删可从 Git 恢复
