# Codex++ /v1/responses 502 Bad Gateway

## 故障现象

Codex++ 通过自定义 Provider 调用 Responses API 时，返回 502：

```
POST http://127.0.0.1:57321/v1/responses
→ 502 Bad Gateway
→ {"status":"failed","message":"供应商「Agnes」请求上游失败，endpoint: https://apihub.agnes-ai.com/v1/chat/completions"}
```

## 架构链路

```
Codex++ UI
  ↓  POST /v1/responses
127.0.0.1:57321 (codex-plus-plus.exe — Owl 原生运行时)
  ↓  转发到 /v1/chat/completions
https://apihub.agnes-ai.com/v1/chat/completions
  ↓  超时
502 ← 57321 层主动切断
```

## 根因

| 因素 | 详情 |
|------|------|
| 直接原因 | 57321 代理层硬编码了 ~30s 的上游请求超时 |
| 根本原因 | 上游 `apihub.agnes-ai.com/v1/chat/completions` 响应时间波动极大（15s~35s+） |
| 超时参数位置 | `codex-plus-plus.exe` 的 Owl 原生运行时（编译层），不暴露在 JS 或 `config.toml` 中 |
| 是否可修改 | ❌ 不可直接修改 |

## 定位过程

### 步骤 1：确认端点可用性

```bash
# /v1/models 正常
curl http://127.0.0.1:57321/v1/models → 200 (4 个模型)

# /v1/responses 直接测试通过（模型名要用完整名 "agnes-2.0-flash"）
curl -X POST http://127.0.0.1:57321/v1/responses \
  -d '{"model":"agnes-2.0-flash","input":"hello"}' → 200
```

### 步骤 2：捕获超时证据

```bash
curl -v -X POST http://127.0.0.1:57321/v1/responses \
  -H "Authorization: Bearer sk-xxx" \
  -d '{"model":"agnes-2.0-flash","input":"hello","temperature":1.0}'
# 观察到：逐秒等待 → 30+s 后 → 502
```

### 步骤 3：对比测试确认

| 序号 | 路径 | 耗时 | 结果 |
|------|------|------|------|
| ① | 直连 Agnes API | **22.65s** | 200 ✅ |
| ② | 直连 Agnes API | **15.72s** | 200 ✅ |
| ③ | 经 57321（缓存命中） | **7.29s** | 200 ✅ |
| ④ | 经 57321（新请求） | **32s** | 502 ❌ |

→ 直连 Agnes 本身就需要 15~35s，证明不是 57321 代理实现的问题，而是 **上游慢 + 代理层超时短** 共同导致。

### 步骤 4：排除上游返回 502

使用 `--max-time 60` 直连 Agnes 即使慢也能成功返回 200，说明 502 来自 57321 层主动切断。

## 解决方案

### 方案 A：本地反向代理（推荐）

绕过硬编码超时，在本地加一层长超时代理：

```toml
# config.toml
[model_providers.custom]
base_url = "http://127.0.0.1:18080/v1"  # 指向本地代理
```

代理代码（Node.js，约 20 行）设置 timeout=120s。

### 方案 B：直接使用 Chat Completions API

跳过 Responses API 转换层，直接发 `/v1/chat/completions` 请求（需修改 Codex 客户端配置）。

## 相关配置

```toml
[model_providers.custom]
name = "custom"
wire_api = "responses"      # 使用 Responses API 协议
requires_openai_auth = true # 需要 Bearer token
base_url = "http://127.0.0.1:57321/v1"
```
