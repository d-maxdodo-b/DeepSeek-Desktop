# 建议反馈: 盘根工作区失效 + steer 打断增强 + 模块化使用正反馈

> 环境: Windows 11, dsh v0.1.0-rc.5(源码 pnpm 部署, web profile)
> 反馈日期: 2026-08-14 | 反馈人: dsh 桌面壳深度用户(Electron 壳 + 多agent协作集成, 深度使用 3 天)

---

## 建议 1: 工作区设为盘根(F:\) 时 title 为空导致工作区静默失效

<details>
<summary>详情</summary>

- **复现**: Web UI → 添加工作区 → 选择 `F:\`(盘根) → 输入框仍只读, 显示 "选择一个工作区开始"
- **实际**: workspace.json 中 `title: ""`(basename("F:\\") 为空), 会话无法 attach, UI 静默不认该工作区, 无任何提示
- **根因**: `workspace.create({path})` 用 basename 派生 title, 盘根 basename 为空串
- **建议**: basename 为空时回退用盘符名(如 `F`)或明确报错提示, 避免静默失效
- **验收**: 选盘根时得到有效 title 或明确错误提示

</details>

---

## 建议 2: busyEnter=steer 支持真正打断当前步骤(对齐 codex 体验)

<details>
<summary>详情</summary>

- **现状**: `busyEnter: steer` 时, agent 忙中回车 = `send(input, 'next-step', true)`(packages/core/agent-loop/src/agent.ts:126), 消息插入 next-step 位但**不中断当前 step**; 当前 LLM/工具调用完成后才轮到。源码注释也承认: "Direct steer is intentionally best-effort: AgentLoop turns a closed-window submission into the next waking Queue item"
- **体验差距**: 长工具调用(如 LSP 索引/全盘搜索)时, 用户插话要等当前 step 完成(可能 30s+), 与 codex 的即时打断体验有差距
- **建议**: 可选增强 — steer 时若当前 step 超过阈值(如 >5s 且非关键写操作), 触发 abort + 重入(类似 cancel 但保留 inbox 语义), 让新指令立即接管
- **验收**: 长 step 中插话能在秒级响应

</details>

---

## 模块化设计正反馈(真心夸夸)

深度使用后, 几个印象最深的点:

1. **"一切皆插件"(Cordis)是彻底的真插件化**: 会话日志 append-only 单一事实源、能力缝三角色(Service Definition/Provider/Consumer)、waterfall 监听器。改工具=挂插件, 不碰 loop——这是 agent 运行时领域极罕见的设计完成度。

2. **工程质量顶级**: 单文件 100% 覆盖率门控 + keyless 快照 + 契约验证, 在 AI agent 项目里是奢侈配置。30+ 事件类型每种都有明确 schema, 读会话日志像读文档。

3. **会话日志设计聪明**: append-only + 投影派生, 重放/断点续跑天然成立。我们解压 zstd 日志做故障分析, 每事件带 time 戳, 排查效率极高(本次 bug 定位全靠它)。

4. **多agent委派是隐藏惊喜**: subagent/subagent_fork/send_message + continuable 后台模式, 直接支撑我们在壳子里跑多agent协作框架(M1并行/M2分工/M5对抗审查), 几乎零适配。

5. **--dsw-* 语义 token UI 体系**: 38 个 client 包全部走语义 token, 我们注入自定义皮肤/多语言/标题栏几乎不碰官方代码——给第三方改造空间极大。

**一句话**: 目前开源 agent harness 里架构与工程质量最接近"正经产品"的一个, rc 版就有这完成度, 期待正式版。官方加油!

## 附: 已确认正常的能力

- subagent 工具链完整(单回复并行委派 + maxParallelToolCalls=10)
- session-title 自动生成 + 手动重命名
- locale zh 翻译覆盖良好
- token 轨迹(输入/输出/缓存命中)数据完整
