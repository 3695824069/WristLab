# 数据库设计

## 概览

- **引擎**: SQLite（better-sqlite3，原生绑定）
- **文件**: `server/fit_hub.db`
- **迁移**: `server/migrations/`（当前 1 个迁移文件）
- **WAL 模式**: 开启（提高并发读取性能）

## 7 张表

### users — 用户表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增主键 |
| phone | TEXT UNIQUE | 手机号（登录标识） |
| nickname | TEXT | 昵称 |
| avatar | TEXT | 头像 URL |
| email | TEXT | 绑定邮箱（可选，migration 001 添加） |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### sms_codes — 短信验证码

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | - |
| phone | TEXT | 手机号 |
| code | TEXT | 验证码 |
| used | INTEGER | 0=未使用 1=已使用 |
| expires_at | DATETIME | 过期时间 |
| created_at | DATETIME | - |

### email_codes — 邮箱验证码

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | - |
| email | TEXT | 邮箱 |
| code | TEXT | 验证码 |
| used | INTEGER | 0=未使用 1=已使用 |
| expires_at | DATETIME | 过期时间 |
| created_at | DATETIME | - |

### workout_records — 训练打卡记录

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | - |
| user_id | INTEGER FK | 用户 ID |
| plan_id | TEXT | 计划 ID |
| checkin_date | TEXT | 打卡日期（YYYY-MM-DD） |
| created_at | DATETIME | - |

### workout_exercise_records — 动作级训练记录（V1）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | - |
| user_id | INTEGER FK | - |
| record_id | INTEGER FK | 关联 workout_records |
| exercise_key | TEXT | 动作标识 |
| completed | INTEGER | 0/1 是否完成 |
| created_at | DATETIME | - |

### favorites — 收藏

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | - |
| user_id | INTEGER FK | - |
| target_type | TEXT | 收藏类型（course/exercise/etc） |
| target_id | TEXT | 被收藏对象的 ID |
| created_at | DATETIME | - |
| UNIQUE(user_id, target_type, target_id) | - | - |

### schema_versions — 迁移版本

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | - |
| version | INTEGER | 版本号 |
| name | TEXT | 迁移名称 |
| applied_at | DATETIME | 执行时间 |

## 迁移历史

| 版本 | 名称 | 内容 |
|------|------|------|
| 001 | add_email_column | 给 users 表增加 email 字段 |

## 约束

- 表结构变更必须通过 `server/migrations/` 迁移文件
- 禁止直接 inline `ALTER TABLE`
- 禁止修改 `fit_hub.db` 文件名
