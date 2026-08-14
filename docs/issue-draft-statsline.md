# Issue 草稿: Web UI 会话统计条缺少 LLM/工具调用耗时

## 标题(中文行动/结果句)
会话统计条不显示 "LLM 时长 · 工具调用时长"(StatsLine 组数据缺失)

## 正文

Web UI 会话统计条(输入框上方)只显示 "N 轮 · M 步 | 首 token 平均 X · Y tok/s | 缓存命中 Z% | 输入 A tok · 输出 B tok", **缺少 "LLM XmXs · 工具调用 YmYs" 段**。

<details>
<summary>复现、预期与验收</summary>

- **复现步骤**:
  1. 启动 `dsh web`(v0.1.0-rc.5)
  2. 新会话并完成多轮对话(含多次工具调用)
  3. 查看输入框上方的统计条
- **实际结果**: 统计条缺 "LLM 时长 · 工具调用时长" 组; 其余(轮次/步/首token/tok每秒/缓存命中/输入输出token)正常
- **预期结果**: 显示 LLM 与工具调用耗时(如 "LLM 6m4s · 工具调用 1m26s")
- **环境**: Windows 10/11, dsh v0.1.0-rc.5(源码 pnpm 部署), web profile
- **根因分析(已排查)**: `StatsLine.tsx` 的 `deriveStats()` 依赖 assistant 节点的 `timing.stepStartTime/completedTime` 与 tool-result 的 `callTime` 计算 llmMs/toolMs; 检查 session.jsonl.zstd 日志, step/start 仅含 `{turn, step}`, tool/result 仅含 `time`, **无 timing/callTime 字段** → llmMs=0, toolMs=0 → 按 "a group with no data drops out whole" 设计整组消失
- **验收条件**: 有真实会话数据时, 统计条完整显示 "轮次 | LLM时长 · 工具调用时长 | 首token | tok/s | 缓存命中 | 输入/输出"

</details>
