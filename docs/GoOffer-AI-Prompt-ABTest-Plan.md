# GoOffer AI 面试总结 Prompt A/B Test 与测评集方案

版本：v0.1  
日期：2026-05-29  
适用阶段：MVP  
目标读者：Codex / 产品 / 研发 / 数据分析  
关联文档：`docs/GoOffer-PRD.md`

## 1. 文档目标

本文档用于指导 GoOffer MVP 中“AI 面试总结”功能的 Prompt A/B Test、数据埋点、测评集收集、离线评估和在线分析落地。

Codex 后续实现时应优先保证：

1. Prompt 可版本化管理。
2. 用户实验分组稳定。
3. 每次 AI 生成都有完整记录。
4. 用户关键行为可分析。
5. 线上样本可以脱敏后进入离线测评集。
6. 实验结果可以通过 SQL 或脚本复现分析。

## 2. 实验背景

GoOffer 的 AI 面试总结是 MVP 的核心差异化能力。用户在记录面试问题和回答后，希望系统帮助其完成结构化复盘，发现回答不足，并获得下一轮准备建议。

不同前置 Prompt 会显著影响 AI 输出质量，因此需要通过 A/B Test 验证哪种 Prompt 更能提升用户价值。

## 3. 实验目标

### 3.1 产品目标

验证“行动导向型 Prompt”是否优于“基础总结型 Prompt”。

### 3.2 用户目标

帮助求职者获得更具体、可行动、可保存、可复用的面试复盘。

### 3.3 技术目标

建立一个轻量实验框架，使后续可以继续测试：

- 不同 Prompt。
- 不同输出结构。
- 不同模型参数。
- 不同 AI 总结展示方式。

## 4. 实验假设

主假设：

> 相比基础总结型 Prompt，行动导向型 Prompt 会提升 AI 总结保存率、满意度和后续复访率。

辅助假设：

1. 行动导向型 Prompt 会提高用户评分。
2. 行动导向型 Prompt 会提高用户复制或再次查看总结的比例。
3. 行动导向型 Prompt 不应显著增加生成失败率、生成耗时和 token 成本。

## 5. 实验范围

### 5.1 本次实验包含

- AI 面试总结前置 Prompt A/B Test。
- 用户维度稳定分流。
- AI 生成记录保存。
- 前端与后端埋点。
- 线上行为数据分析。
- 离线测评集收集和评分。

### 5.2 本次实验不包含

- 多模型 A/B Test。
- UI 展示样式 A/B Test。
- 自定义 Prompt。
- 自定义输出结构。
- 自动化实验后台。
- 统计显著性自动计算平台。

MVP 阶段可以通过数据库配置、SQL 和简单脚本完成实验分析。

## 6. 实验版本设计

### 6.1 A 组：基础总结型 Prompt

目标：生成简洁、概括型面试复盘。

输出结构：

```text
面试整体总结
表现亮点
存在问题
改进建议
```

适用判断：

- 输出是否清晰。
- 用户是否认为足够有帮助。
- 是否能作为基础对照组。

### 6.2 B 组：行动导向型 Prompt

目标：生成具体、可执行、面向下一轮准备的面试复盘。

输出结构：

```text
本轮面试复盘
回答表现亮点
回答不足与原因
可优化回答示例
下一轮准备清单
后续跟进行动
```

适用判断：

- 是否更能帮助用户改进回答。
- 是否更容易被保存。
- 是否能提升满意度和复访。

## 7. 控制变量

为了确保实验差异主要来自 Prompt，以下变量应保持一致：

| 变量 | 要求 |
|---|---|
| AI 模型 | A/B 组使用同一模型 |
| temperature | A/B 组使用相同参数 |
| 输入字段 | A/B 组使用同一输入快照结构 |
| UI 展示 | A/B 组使用同一前端展示组件 |
| 保存逻辑 | A/B 组使用同一保存流程 |
| 评分入口 | A/B 组使用同一评分入口 |
| 分流粒度 | 按用户分流，不按请求随机 |

## 8. 用户分流方案

### 8.1 分流原则

采用用户维度稳定分流。

同一个用户在同一个实验中始终看到同一个 Prompt 版本。

不要每次生成 AI 总结时随机分流，否则会导致：

- 用户体验不一致。
- 数据归因困难。
- 同一用户行为互相污染。

### 8.2 分流比例

MVP 默认：

```text
A 组：50%
B 组：50%
```

### 8.3 分流伪代码

```ts
function assignVariant(userId: string): "prompt_a" | "prompt_b" {
  const bucket = stableHash(userId) % 100;

  if (bucket < 50) {
    return "prompt_a";
  }

  return "prompt_b";
}
```

### 8.4 推荐实现

用户首次进入实验时：

1. 后端检查 `experiment_assignments` 是否已有记录。
2. 如果已有记录，直接使用该分组。
3. 如果没有记录，根据 `user_id` 计算分组。
4. 将分组结果写入 `experiment_assignments`。
5. 后续所有 AI 总结请求使用该分组。

## 9. 数据模型设计

以下为推荐数据模型。具体字段类型可根据后续技术栈调整。

### 9.1 experiments

记录实验定义。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | string | 是 | 实验 ID |
| name | string | 是 | 实验名称 |
| status | enum | 是 | draft / running / paused / completed |
| primary_metric | string | 是 | 主指标 |
| description | text | 否 | 实验说明 |
| start_at | datetime | 否 | 开始时间 |
| end_at | datetime | 否 | 结束时间 |
| created_at | datetime | 是 | 创建时间 |
| updated_at | datetime | 是 | 更新时间 |

推荐实验 ID：

```text
ai_summary_prompt_ab_test_v1
```

### 9.2 experiment_variants

记录实验版本。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | string | 是 | 版本 ID |
| experiment_id | string | 是 | 所属实验 |
| variant_key | string | 是 | prompt_a / prompt_b |
| traffic_ratio | number | 是 | 流量比例 |
| prompt_version_id | string | 是 | 关联 Prompt 版本 |
| description | text | 否 | 版本说明 |
| created_at | datetime | 是 | 创建时间 |

### 9.3 prompt_versions

记录 Prompt 版本。Prompt 必须版本化，不允许只硬编码在业务代码中。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | string | 是 | Prompt 版本 ID |
| name | string | 是 | Prompt 名称 |
| prompt_text | text | 是 | Prompt 内容 |
| model | string | 是 | 使用模型 |
| temperature | number | 是 | 生成参数 |
| output_schema | json | 否 | 输出结构 |
| is_active | boolean | 是 | 是否可用 |
| created_at | datetime | 是 | 创建时间 |

### 9.4 experiment_assignments

记录用户实验分组。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | string | 是 | 分组 ID |
| experiment_id | string | 是 | 实验 ID |
| user_id | string | 是 | 用户 ID |
| variant_id | string | 是 | 实验版本 ID |
| assigned_at | datetime | 是 | 分配时间 |

建议唯一约束：

```text
unique(experiment_id, user_id)
```

### 9.5 ai_generation_runs

记录每次 AI 生成调用。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | string | 是 | 生成记录 ID |
| user_id | string | 是 | 用户 ID |
| job_id | string | 是 | 岗位 ID |
| interview_id | string | 是 | 面试 ID |
| experiment_id | string | 否 | 实验 ID |
| variant_id | string | 否 | 实验版本 ID |
| prompt_version_id | string | 是 | Prompt 版本 ID |
| input_snapshot | json | 是 | 本次输入快照 |
| output_text | text | 否 | AI 输出 |
| latency_ms | number | 否 | 生成耗时 |
| token_input | number | 否 | 输入 token |
| token_output | number | 否 | 输出 token |
| cost | number | 否 | 本次成本 |
| status | enum | 是 | success / failed |
| error_message | text | 否 | 错误信息 |
| created_at | datetime | 是 | 生成时间 |

重点要求：

- 必须保存 `input_snapshot`。
- 不要只保存 `job_id` 和 `interview_id`。
- 用户后续可能编辑岗位或面试内容，没有快照就无法复现实验。

### 9.6 analytics_events

记录用户行为事件。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | string | 是 | 事件 ID |
| user_id | string | 否 | 用户 ID |
| event_name | string | 是 | 事件名称 |
| experiment_id | string | 否 | 实验 ID |
| variant_id | string | 否 | 实验版本 ID |
| entity_type | string | 否 | job / interview / summary |
| entity_id | string | 否 | 关联对象 ID |
| properties | json | 否 | 事件属性 |
| created_at | datetime | 是 | 事件时间 |

## 10. 事件埋点设计

### 10.1 前端埋点

| 事件名 | 触发时机 | 是否 MVP 必须 |
|---|---|---|
| ai_summary_entry_viewed | 用户看到 AI 总结入口 | 否 |
| ai_summary_requested | 用户点击生成 AI 总结 | 是 |
| ai_summary_saved | 用户保存 AI 总结 | 是 |
| ai_summary_edited | 用户编辑 AI 总结 | 否 |
| ai_summary_regenerated | 用户重新生成总结 | 是 |
| ai_summary_rated | 用户提交满意度评分 | 是 |
| ai_summary_copied | 用户复制总结内容 | 否 |
| ai_summary_viewed_again | 用户再次查看已保存总结 | 否 |

### 10.2 后端埋点

| 事件名 | 触发时机 | 是否 MVP 必须 |
|---|---|---|
| ai_summary_generated | AI 总结生成成功 | 是 |
| ai_summary_failed | AI 总结生成失败 | 是 |

### 10.3 事件属性

每个 AI 相关事件建议携带以下属性：

```json
{
  "experiment_id": "ai_summary_prompt_ab_test_v1",
  "variant_id": "prompt_b",
  "prompt_version_id": "prompt_b_v1",
  "job_id": "job_123",
  "interview_id": "interview_456",
  "generation_id": "gen_789"
}
```

评分事件额外携带：

```json
{
  "score": 5
}
```

失败事件额外携带：

```json
{
  "error_code": "MODEL_TIMEOUT",
  "error_message": "AI generation timed out"
}
```

## 11. AI 总结请求流程

### 11.1 主流程

```text
用户点击“生成 AI 总结”
-> 前端发送生成请求
-> 后端校验用户权限
-> 后端读取或创建实验分组
-> 后端读取对应 Prompt 版本
-> 后端组装 input_snapshot
-> 后端调用 AI 模型
-> 后端写入 ai_generation_runs
-> 后端写入 ai_summary_generated 或 ai_summary_failed
-> 后端返回结果给前端
-> 前端展示结果
-> 用户保存 / 评分 / 重新生成
-> 前端继续写入 analytics_events
```

### 11.2 输入快照结构

建议 `input_snapshot` 使用以下结构：

```json
{
  "job": {
    "company_name": "某公司",
    "job_title": "后端开发工程师",
    "city": "上海",
    "job_description": "岗位描述文本",
    "requirements": "任职要求文本"
  },
  "interview": {
    "round": "一面",
    "interview_type": "视频",
    "interview_time": "2026-05-29T10:00:00+08:00",
    "preparation_notes": "用户填写的准备事项"
  },
  "questions": [
    {
      "question": "请介绍一个你最熟悉的项目",
      "answer": "用户回答内容",
      "question_type": "项目经历",
      "self_rating": 3,
      "improvement_notes": "用户自评备注"
    }
  ]
}
```

## 12. API 合同建议

具体路径可根据项目路由规范调整。

### 12.1 生成 AI 总结

```http
POST /api/interviews/:interviewId/ai-summary/generate
```

请求体：

```json
{
  "regenerate": false
}
```

响应体：

```json
{
  "generation_id": "gen_789",
  "experiment_id": "ai_summary_prompt_ab_test_v1",
  "variant_id": "prompt_b",
  "prompt_version_id": "prompt_b_v1",
  "summary": {
    "summary": "本轮面试复盘...",
    "strengths": "表现亮点...",
    "weaknesses": "回答不足...",
    "improvement_suggestions": "优化建议...",
    "next_round_preparation": "下一轮准备..."
  }
}
```

### 12.2 保存 AI 总结

```http
POST /api/ai-summaries
```

请求体：

```json
{
  "generation_id": "gen_789",
  "job_id": "job_123",
  "interview_id": "interview_456",
  "summary": "本轮面试复盘...",
  "strengths": "表现亮点...",
  "weaknesses": "回答不足...",
  "improvement_suggestions": "优化建议...",
  "next_round_preparation": "下一轮准备..."
}
```

### 12.3 提交 AI 总结评分

```http
POST /api/ai-summaries/:summaryId/rating
```

请求体：

```json
{
  "score": 5,
  "comment": "建议很具体，能指导下一轮准备"
}
```

## 13. 在线分析指标

### 13.1 主指标

AI 总结保存率：

```text
ai_summary_saved / ai_summary_generated
```

保存代表用户认为 AI 输出值得留下，是 MVP 阶段最适合作为主指标的行为。

### 13.2 辅助指标

| 指标 | 计算方式 | 解释 |
|---|---|---|
| 满意度平均分 | avg(score) | 用户主观认可度 |
| 重新生成率 | ai_summary_regenerated / ai_summary_generated | 首次输出是否满足需求 |
| 编辑率 | ai_summary_edited / ai_summary_saved | 输出是否需要加工 |
| 复制率 | ai_summary_copied / ai_summary_generated | 内容是否可复用 |
| 再次查看率 | ai_summary_viewed_again / ai_summary_saved | 总结是否有长期价值 |
| 7 日回访率 | 生成后 7 天内再次访问 | 是否促进持续使用 |

### 13.3 保护指标

| 指标 | 说明 |
|---|---|
| 生成失败率 | 失败不能显著增加 |
| 平均生成耗时 | 不能明显拖慢体验 |
| 平均 token 成本 | 成本不能明显失控 |
| 负反馈率 | 低评分和用户投诉不能增加 |

## 14. 在线分析 SQL 示例

以下 SQL 以 PostgreSQL 风格编写，具体语法可按实际数据库调整。

### 14.1 保存率

```sql
select
  variant_id,
  count(*) filter (where event_name = 'ai_summary_generated') as generated_count,
  count(*) filter (where event_name = 'ai_summary_saved') as saved_count,
  count(*) filter (where event_name = 'ai_summary_saved') * 1.0
    / nullif(count(*) filter (where event_name = 'ai_summary_generated'), 0) as save_rate
from analytics_events
where experiment_id = 'ai_summary_prompt_ab_test_v1'
group by variant_id;
```

### 14.2 平均评分

```sql
select
  variant_id,
  avg((properties->>'score')::numeric) as avg_score,
  count(*) as rating_count
from analytics_events
where event_name = 'ai_summary_rated'
  and experiment_id = 'ai_summary_prompt_ab_test_v1'
group by variant_id;
```

### 14.3 重新生成率

```sql
select
  variant_id,
  count(*) filter (where event_name = 'ai_summary_regenerated') * 1.0
    / nullif(count(*) filter (where event_name = 'ai_summary_generated'), 0) as regenerate_rate
from analytics_events
where experiment_id = 'ai_summary_prompt_ab_test_v1'
group by variant_id;
```

### 14.4 生成耗时和成本

```sql
select
  variant_id,
  avg(latency_ms) as avg_latency_ms,
  avg(token_input) as avg_input_tokens,
  avg(token_output) as avg_output_tokens,
  avg(cost) as avg_cost
from ai_generation_runs
where experiment_id = 'ai_summary_prompt_ab_test_v1'
  and status = 'success'
group by variant_id;
```

## 15. 离线测评集设计

### 15.1 测评集目标

离线测评集用于回答：

> 在不影响真实用户的情况下，哪个 Prompt 生成的面试总结质量更高？

### 15.2 样本来源

测评样本可以来自：

1. 产品团队手工构造样本。
2. 内部测试用户样本。
3. 线上真实样本脱敏后沉淀。

MVP 初始建议规模：

```text
30-50 条样本
```

### 15.3 eval_cases

记录测评样本。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | string | 是 | 测评样本 ID |
| source | enum | 是 | synthetic / production |
| job_title | string | 是 | 岗位名称 |
| company_type | string | 否 | 大厂 / 创业公司 / 外企等 |
| job_description | text | 否 | 岗位描述 |
| interview_round | string | 是 | 面试轮次 |
| questions | json | 是 | 面试问题列表 |
| answers | json | 是 | 用户回答列表 |
| user_notes | text | 否 | 用户备注 |
| expected_focus | text | 否 | 期望总结重点 |
| risk_points | text | 否 | 需要识别的问题 |
| pii_removed | boolean | 是 | 是否已脱敏 |
| status | enum | 是 | pending / approved / rejected |
| created_at | datetime | 是 | 创建时间 |

### 15.4 eval_outputs

记录不同 Prompt 在测评样本上的输出。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | string | 是 | 输出 ID |
| eval_case_id | string | 是 | 测评样本 ID |
| prompt_version_id | string | 是 | Prompt 版本 |
| output_text | text | 是 | AI 输出 |
| latency_ms | number | 否 | 生成耗时 |
| token_input | number | 否 | 输入 token |
| token_output | number | 否 | 输出 token |
| created_at | datetime | 是 | 创建时间 |

### 15.5 eval_scores

记录人工评分。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | string | 是 | 评分 ID |
| eval_output_id | string | 是 | 输出 ID |
| evaluator_id | string | 是 | 评估人 |
| relevance_score | number | 是 | 相关性，1-5 |
| specificity_score | number | 是 | 具体性，1-5 |
| actionability_score | number | 是 | 可行动性，1-5 |
| structure_score | number | 是 | 结构清晰度，1-5 |
| next_round_value_score | number | 是 | 下一轮准备价值，1-5 |
| hallucination_risk_score | number | 是 | 编造风险，1-5，越高越差 |
| overall_score | number | 是 | 综合分 |
| comment | text | 否 | 评语 |
| created_at | datetime | 是 | 评分时间 |

## 16. 离线评分规则

### 16.1 评分维度

| 维度 | 分值 | 说明 |
|---|---|---|
| 相关性 | 1-5 | 是否紧扣岗位、问题和回答 |
| 具体性 | 1-5 | 是否指出具体问题，而不是泛泛而谈 |
| 可行动性 | 1-5 | 是否告诉用户下一步怎么改 |
| 结构清晰度 | 1-5 | 是否易读、易保存、易回看 |
| 下一轮准备价值 | 1-5 | 是否帮助准备后续面试 |
| 编造风险 | 1-5 | 是否存在臆测、过度判断或无依据建议，越高越差 |

### 16.2 综合分

```text
综合分 =
相关性
+ 具体性
+ 可行动性
+ 结构清晰度
+ 下一轮准备价值
- 编造风险
```

### 16.3 离线分析维度

需要输出：

1. A/B 平均综合分。
2. A/B 胜率。
3. 不同岗位类型下的表现。
4. 不同面试轮次下的表现。
5. 高风险样本数量。
6. 常见失败模式总结。

## 17. 线上样本进入测评集流程

### 17.1 流程

```text
线上 AI 生成记录
-> 抽样候选样本
-> 脱敏处理
-> 人工审核
-> 标注 expected_focus 和 risk_points
-> 状态改为 approved
-> 进入 eval_cases
```

### 17.2 脱敏规则

必须脱敏：

- 用户姓名。
- 手机号。
- 邮箱。
- 微信号。
- 会议链接。
- 具体面试官姓名。
- 具体公司联系人。
- 明确个人身份的信息。
- 用户不希望被保留的隐私内容。

可以保留：

- 岗位方向。
- 公司类型。
- 面试轮次。
- 问题类型。
- 回答质量。
- 求职阶段。

示例：

```text
原始：我面试了字节跳动上海商业化后端岗位，面试官张三问我 Redis 缓存穿透。
脱敏：我面试了某大厂上海后端岗位，面试官问我 Redis 缓存穿透。
```

## 18. 实验决策标准

B 组可以胜出，如果满足以下条件之一：

1. B 组 AI 总结保存率高于 A 组 10% 以上。
2. B 组满意度平均分高于 A 组 0.3 分以上。
3. B 组离线综合评分明显高于 A 组。

同时必须满足保护条件：

1. 生成失败率没有显著上升。
2. 平均生成耗时没有明显恶化。
3. 平均 token 成本可接受。
4. 编造风险没有增加。
5. 用户负反馈没有增加。

如果在线指标和离线指标冲突：

- 在线保存率高但离线质量低：优先排查是否标题党式输出、过度承诺或用户误判。
- 离线质量高但在线保存率低：优先排查输出过长、展示不友好或用户不理解价值。

## 19. 实施任务拆解

### 19.1 P0 必做

1. 新增 Prompt 版本管理。
2. 新增实验定义和用户分组能力。
3. 实现 AI 总结生成时读取用户分组。
4. 保存 `ai_generation_runs`。
5. 保存 `analytics_events`。
6. 前端接入核心埋点：
   - `ai_summary_requested`
   - `ai_summary_saved`
   - `ai_summary_regenerated`
   - `ai_summary_rated`
7. 后端接入核心埋点：
   - `ai_summary_generated`
   - `ai_summary_failed`
8. 提供基础 SQL 分析。

### 19.2 P1 应做

1. 增加离线测评集表。
2. 增加脱敏样本录入流程。
3. 增加人工评分记录。
4. 增加复制、再次查看、编辑等扩展埋点。
5. 增加简单实验结果导出脚本。

### 19.3 P2 后续扩展

1. 实验后台管理。
2. 自动统计显著性计算。
3. Prompt 在线切换。
4. 多模型对比。
5. 自动化离线评估流水线。

## 20. 测试计划

### 20.1 分流测试

- 同一用户多次请求时，分组保持不变。
- 不同用户可以按比例进入 A/B 组。
- 实验暂停后，不应继续创建新分组。

### 20.2 AI 生成记录测试

- 成功生成时写入 `ai_generation_runs`。
- 失败生成时写入失败状态和错误信息。
- 每次生成都保存 `input_snapshot`。
- 生成记录包含 Prompt 版本和实验分组。

### 20.3 埋点测试

- 点击生成时记录 `ai_summary_requested`。
- 生成成功时记录 `ai_summary_generated`。
- 生成失败时记录 `ai_summary_failed`。
- 保存总结时记录 `ai_summary_saved`。
- 用户评分时记录 `ai_summary_rated`。

### 20.4 权限测试

- 用户不能基于他人的面试记录生成 AI 总结。
- 用户不能查看他人的 AI 生成记录。
- 用户不能提交他人总结的评分。

### 20.5 测评集测试

- 未脱敏样本不能进入 approved 状态。
- rejected 样本不参与离线评估。
- 同一测评样本可以关联多个 Prompt 输出。

## 21. 风险与应对

### 21.1 用户量不足导致在线 A/B 不显著

应对：

- 不强行只看显著性。
- 结合离线测评、用户评分和访谈反馈判断。

### 21.2 Prompt B 输出更长导致用户不保存

应对：

- 在线分析保存率和满意度。
- 离线评估输出长度与可读性。
- 后续可测试“长版 vs 精简版”。

### 21.3 AI 输出存在编造

应对：

- Prompt 要求仅基于输入内容判断。
- 离线评分中加入编造风险。
- 用户界面提示 AI 总结仅供参考。

### 21.4 线上数据涉及隐私

应对：

- 测评集入库前必须脱敏。
- 不将原始隐私数据用于公开示例。
- 仅保留必要字段。

### 21.5 Prompt 变更无法追溯

应对：

- Prompt 必须版本化。
- 每次 AI 调用必须保存 `prompt_version_id`。

## 22. Codex 实现注意事项

后续实现时，Codex 应遵循：

1. 先读取现有技术栈和数据层实现，再决定表结构和接口形式。
2. 不要引入重型实验平台依赖。
3. 不要把 Prompt 只写死在前端。
4. 不要让前端决定实验分组。
5. 不要只记录用户点击，不记录 AI 生成结果。
6. 不要只保存最终总结，不保存输入快照。
7. 所有实验数据必须带 `experiment_id`、`variant_id`、`prompt_version_id`。
8. MVP 优先完成可分析闭环，再考虑实验后台。

## 23. 最小可行交付

第一版实现完成后，应能回答以下问题：

1. 每个用户属于哪个 Prompt 组？
2. 某次 AI 总结用了哪个 Prompt？
3. 某次 AI 总结基于什么输入生成？
4. A/B 两组分别生成了多少次？
5. A/B 两组分别保存了多少次？
6. A/B 两组平均评分是多少？
7. A/B 两组失败率、耗时、成本是否有差异？
8. 哪些线上样本可以脱敏进入离线测评集？

如果以上问题都能通过数据回答，则本实验系统满足 MVP 要求。
