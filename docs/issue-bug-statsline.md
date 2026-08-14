# Bug 反馈: Web UI 会话统计条缺少 LLM/工具调用耗时

> 环境: Windows 11, dsh v0.1.0-rc.5(源码 pnpm 部署, web profile), deepseek-v4-flash
> 反馈日期: 2026-08-14

## 一句话
Web UI 会话统计条(输入框上方)不显示 "LLM XmXs · 工具调用 YmYs" 组, 其余统计正常。

<details>
<summary>复现、预期与验收</summary>

- **复现步骤**:
  1. 启动 `dsh web`
  2. 新会话完成多轮对话(含多次工具调用, 如 Read/Grep/Glob/pwsh)
  3. 查看输入框上方统计条
- **实际结果**: 统计条只显示 "N 轮 · M 步 | 首 token 平均 X · Y tok/s | 缓存命中 Z% | 输入 A tok · 输出 B tok", 缺少 "LLM XmXs · 工具调用 YmYs" 段
- **预期结果**: 显示 "LLM 6m4s · 工具调用 1m26s" 组
- **根因(已排查)**: `packages/client/ui-conversation/src/client/chat/StatsLine.tsx` 的 `deriveStats()` 依赖 assistant 节点的 `timing.stepStartTime/completedTime` 与 tool-result 的 `callTime` 计算 llmMs/toolMs。解压检查 `session.jsonl.zstd`: `step/start` 仅含 `{turn, step}`, `tool/result` 仅含 `time`, **日志未写入 timing/callTime 字段** → llmMs=0, toolMs=0 → 按 "a group with no data drops out whole" 整组消失
- **建议修复**: ①持久化层写入 timing/callTime; 或 ②`deriveStats` 用事件 `time` 差值兜底: LLM 耗时 = step/end.time - step/start.time, 工具耗时 = tool/result.time - tool/call.time(日志里这些时间戳都存在, 见附)
- **附(日志实际数据)**: `step/start`: `{"type":"step/start","seq":6,"time":1786688818489,"data":{"turn":1,"step":1}}`; `tool/result`: `{"type":"tool/result","seq":329,"time":1786688822583,"data":{...,"message":{...}}}` — 均有 time 但无 timing/callTime
- **验收条件**: 真实会话下统计条完整显示 6 组(轮次/LLM时长·工具时长/首token/tok每秒/缓存命中/输入输出)

</details>
