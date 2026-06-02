# GoOffer Cloudflare Pages + Supabase 上线技术方案

版本：v0.1  
日期：2026-06-02  
适用阶段：MVP 上线  
关联文档：

- `docs/GoOffer-PRD.md`
- `docs/GoOffer-Design-Spec.md`
- `docs/GoOffer-AI-Prompt-ABTest-Plan.md`
- `docs/ui-demo/index.html`
- `docs/ui-demo/app.js`
- `docs/ui-demo/styles.css`

## 1. 方案结论

GoOffer 正式上线采用：

```text
Cloudflare Pages
-> Vite React 前端
-> Supabase Auth / Postgres / Storage
-> Cloudflare Pages Functions AI 代理
-> 用户绑定自己的 AI API Key
```

当前仓库还没有正式前端工程、后端、数据库迁移和部署配置，已有内容主要是 PRD、设计规范和静态 Demo。静态 Demo 已覆盖 Dashboard、Jobs、Job Detail、Offer Comparison、截图识别入口和 AI 总结模拟逻辑；上线版应保留现有产品形态，但把模拟数据和前端内存状态替换为 Supabase 持久化数据与服务端 AI 调用。

这版方案不再优先使用 Cloudflare D1 作为数据库。原因是 GoOffer 的核心数据是用户私有的关系型数据，包括岗位、面试、问答、AI 生成记录、Offer 和实验埋点。Supabase 的 Postgres、Auth、Row Level Security 和 Storage 更适合快速交付 MVP，也能减少自研认证、权限和数据库运维工作。

## 2. 技术栈

| 层级 | 选择 | 说明 |
|---|---|---|
| 前端框架 | Vite + React + TypeScript | 当前 Demo 是 SPA 形态，后续页面状态、表单和数据联动较多，React 更适合工程化维护。 |
| 路由 | React Router | 覆盖 Dashboard、Jobs、Job Detail、Offer Comparison 和设置页。 |
| 数据请求 | `@supabase/supabase-js` + TanStack Query | Supabase 负责 Auth 和业务数据；Query 管理缓存、加载、错误和乐观更新。 |
| 样式 | Tailwind CSS | 复用设计规范中的颜色、圆角、间距和响应式 token。 |
| 认证 | Supabase Auth | 推荐上线版使用邮箱密码登录；`profiles.username` 保留用户名展示和唯一昵称。 |
| 数据库 | Supabase Postgres | 存岗位、面试、问答、AI 总结、Offer、Prompt 版本和埋点。 |
| 权限 | Supabase RLS | 所有用户私有表必须按 `user_id = auth.uid()` 限制读写。 |
| 图片存储 | Supabase Storage | 岗位截图默认不保存；如需保存，放入私有 bucket。 |
| AI 代理 | Cloudflare Pages Functions | 处理截图识别、AI 总结、用户 API Key 加密和第三方模型调用。 |
| AI Provider | OpenAI-compatible BYOK | 用户绑定自己的 `base_url`、`model`、`api_key`；截图识别要求模型支持视觉输入。 |
| 校验 | Zod | 统一表单、API 请求、AI 结构化返回校验。 |
| 部署 | Cloudflare Pages Git 集成 | 前端静态构建产物部署到 Pages，`/api/*` 由 Pages Functions 处理。 |

参考依据：

- Cloudflare Pages 可部署 React 等前端框架，并支持 Functions 和环境变量绑定。  
  https://developers.cloudflare.com/pages/
- Supabase Auth 集成数据库能力，并可结合 RLS 做授权。  
  https://supabase.com/docs/guides/auth/
- Supabase RLS 可与 Supabase Auth 组合，实现从浏览器到数据库的用户级安全。  
  https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Storage bucket 支持 public/private 两种访问模型，私有 bucket 受访问控制约束。  
  https://supabase.com/docs/guides/storage/buckets/fundamentals
- Supabase Edge Functions 支持服务端 TypeScript 函数和 secrets；本方案优先使用 Cloudflare Pages Functions，但后续也可迁移到 Supabase Edge Functions。  
  https://supabase.com/docs/guides/functions

## 3. 总体架构

```text
用户浏览器
  |
  | 静态资源 / SPA
  v
Cloudflare Pages
  |
  | Supabase JS SDK, 带用户 JWT
  v
Supabase Auth + Postgres + Storage
  |
  | RLS: auth.uid() = user_id
  v
用户私有业务数据

用户浏览器
  |
  | Authorization: Bearer <supabase_access_token>
  v
Cloudflare Pages Functions /api/*
  |
  | 校验用户 JWT，读取加密 API Key，调用 AI
  v
OpenAI-compatible Provider
```

业务 CRUD 可以直接通过 Supabase JS SDK 调用 Supabase，由 RLS 保证数据隔离。涉及第三方 AI、用户 API Key、图片转 base64、Prompt 版本、调用日志和成本统计的能力必须走服务端代理，不能放在浏览器里。

## 4. 前端工程方案

建议新增正式工程目录结构：

```text
.
├── package.json
├── vite.config.ts
├── index.html
├── src/
│   ├── main.tsx
│   ├── app/
│   ├── pages/
│   ├── components/
│   ├── features/
│   ├── lib/
│   └── styles/
├── functions/
│   └── api/
├── supabase/
│   ├── migrations/
│   └── seed.sql
└── docs/
```

页面映射：

| 页面 | 路由 | 来源 |
|---|---|---|
| 登录 / 注册 | `/login`, `/register` | 新增 |
| Dashboard | `/` | 当前 Demo `dashboard` |
| Jobs | `/jobs` | 当前 Demo `jobs` |
| Job Detail | `/jobs/:jobId` | 当前 Demo `detail` |
| Offer Comparison | `/offers` | 当前 Demo `offers` |
| 设置 / AI API | `/settings/ai` | 新增 |

前端状态边界：

- 表单本地状态只负责当前编辑内容。
- 岗位、面试、Offer 等持久数据来自 Supabase。
- 筛选、排序、漏斗显示配置可先保存在 URL query 或 localStorage。
- AI 生成状态由 Pages Functions 返回，不直接调用模型。
- API Key 只允许输入和更新，不允许前端读取明文。

## 5. Supabase 数据模型

### 5.1 Auth 与用户资料

上线版建议使用 Supabase Auth 的邮箱密码登录。PRD 中的 `username` 调整为 `profiles.username`，作为展示名和唯一昵称。

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 5.2 岗位与面试

```sql
create type job_status as enum ('待投递', '已投递', '面试中', '已拿Offer', '被拒绝', '已放弃');
create type job_priority as enum ('高', '中', '低');
create type interview_result as enum ('待面试', '等待结果', '失败', '通过');

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company text not null,
  title text not null,
  city text,
  salary_amount text,
  salary_unit text check (salary_unit in ('k', 'w')),
  salary_display text,
  source text,
  priority job_priority not null default '中',
  status job_status not null default '待投递',
  tags text[] not null default '{}',
  description text,
  logo text,
  logo_tone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.interviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  round_label text not null,
  round_name text,
  time timestamptz,
  duration_minutes integer,
  result interview_result not null default '待面试',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.interview_questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  interview_id uuid not null references public.interviews(id) on delete cascade,
  question text,
  answer text,
  created_at timestamptz not null default now()
);
```

### 5.3 Offer 与 AI 总结

```sql
create table public.offers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  location text,
  total_comp_amount text,
  total_comp_unit text check (total_comp_unit in ('k', 'w')),
  total_comp_display text,
  work_style text not null default '线下',
  growth integer not null default 3 check (growth between 1 and 5),
  stability integer not null default 3 check (stability between 1 and 5),
  balance integer not null default 3 check (balance between 1 and 5),
  interest integer not null default 3 check (interest between 1 and 5),
  risk text,
  decision text default '待决定',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, job_id)
);

create table public.ai_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  interview_id uuid references public.interviews(id) on delete set null,
  generation_id uuid,
  overview text not null,
  strengths text[] not null default '{}',
  improvements text[] not null default '{}',
  next text[] not null default '{}',
  created_at timestamptz not null default now()
);
```

### 5.4 用户 AI API 配置

用户绑定自己的 AI API Key，后端加密保存。前端不得读取明文。

```sql
create table public.user_ai_providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'openai-compatible',
  base_url text not null,
  model text not null,
  supports_vision boolean not null default false,
  encrypted_api_key text not null,
  api_key_iv text not null,
  api_key_hint text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);
```

`encrypted_api_key` 使用 Cloudflare Pages secret `AI_API_KEY_ENCRYPTION_SECRET` 通过 AES-GCM 加密。`api_key_hint` 只保存后四位或短提示，例如 `sk-...abcd`。

### 5.5 AI 生成记录和埋点

沿用 `docs/GoOffer-AI-Prompt-ABTest-Plan.md` 的数据闭环，并按 Supabase Postgres 落表：

- `prompt_versions`
- `experiments`
- `experiment_variants`
- `experiment_assignments`
- `ai_generation_runs`
- `analytics_events`
- `eval_cases`
- `eval_outputs`
- `eval_scores`

`ai_generation_runs.input_snapshot` 必须保存当次岗位、面试和问答快照，避免用户后续编辑后无法复现实验。

## 6. RLS 权限规则

所有业务表必须启用 Row Level Security。

通用规则：

```sql
alter table public.jobs enable row level security;
alter table public.interviews enable row level security;
alter table public.interview_questions enable row level security;
alter table public.offers enable row level security;
alter table public.ai_summaries enable row level security;
alter table public.user_ai_providers enable row level security;

create policy "jobs_select_own"
on public.jobs for select
using (auth.uid() = user_id);

create policy "jobs_insert_own"
on public.jobs for insert
with check (auth.uid() = user_id);

create policy "jobs_update_own"
on public.jobs for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "jobs_delete_own"
on public.jobs for delete
using (auth.uid() = user_id);
```

其他用户私有表沿用同样策略。`user_ai_providers` 不对前端开放 `encrypted_api_key` 明文读取；建议前端通过 Cloudflare `/api/me/ai-provider` 获取脱敏后的 provider、base_url、model、supports_vision、api_key_hint。

Supabase service role key 只能放在 Cloudflare Pages Functions 环境变量中，不得进入 `src/`、构建产物、浏览器或日志。

## 7. 图片识别岗位信息

当前静态 Demo 的“截图识别”是根据文件名或图片指纹匹配 preset。正式 MVP 改为：

```text
用户点击新增岗位
-> 上传岗位截图
-> 前端预览图片
-> POST /api/jobs/recognize
-> Cloudflare Function 校验 Supabase JWT
-> 校验图片类型和大小
-> 可选上传到 Supabase Storage 私有 bucket
-> 调用用户绑定的视觉模型
-> 结构化返回岗位字段
-> 前端填入岗位表单
-> 用户确认后保存 jobs
```

接口：

```http
POST /api/jobs/recognize
Content-Type: multipart/form-data
Authorization: Bearer <supabase_access_token>
```

返回：

```json
{
  "company": "ByteDance",
  "title": "高级前端开发工程师",
  "city": "北京",
  "salary_amount": "35 - 50",
  "salary_unit": "k",
  "salary_display": "RMB 35 - 50k",
  "source": "截图识别",
  "tags": ["React", "Next.js", "核心架构组"],
  "description": "负责核心业务 Web 体验、性能优化、组件化建设和跨团队工程协作。",
  "confidence": 0.86,
  "missing_fields": []
}
```

约束：

- 支持 `image/png`、`image/jpeg`、`image/webp`。
- MVP 默认单图最大 10MB。
- 未绑定 API Key 时返回 `AI_PROVIDER_NOT_CONFIGURED`。
- 绑定模型不支持视觉输入时返回 `VISION_MODEL_REQUIRED`。
- 置信度低于 0.7 的字段需要在 UI 上提示用户核对。
- 默认不保存原图；如果保存，使用 Supabase private bucket `job-screenshots`，路径为 `${user_id}/${job_id_or_temp_id}/${uuid}.webp`。

OpenAI 官方文档支持图片以 base64 data URL 等形式输入，也支持结构化输出；因此截图识别应要求模型按 JSON schema 返回字段，后端再用 Zod 二次校验。

参考：

- https://platform.openai.com/docs/guides/images-vision
- https://platform.openai.com/docs/guides/structured-outputs

## 8. AI 总结面试

正式 MVP 的 AI 总结由 Cloudflare Pages Functions 调用用户绑定模型。

流程：

```text
用户点击生成总结
-> POST /api/interviews/:interviewId/ai-summary/generate
-> 校验 Supabase JWT
-> 校验 interview / job 属于当前用户
-> 读取或创建 A/B 实验分组
-> 读取 prompt_versions
-> 组装 input_snapshot
-> 解密用户 API Key
-> 调用用户模型
-> 写入 ai_generation_runs
-> 返回总结草稿
-> 用户点击保存
-> 写入 ai_summaries
-> 写入 analytics_events
```

生成接口：

```http
POST /api/interviews/:interviewId/ai-summary/generate
Authorization: Bearer <supabase_access_token>
```

请求：

```json
{
  "regenerate": false
}
```

返回：

```json
{
  "generation_id": "uuid",
  "prompt_version_id": "prompt_b_v1",
  "summary": {
    "overview": "本轮面试表达流畅，能说明项目背景和业务目标。",
    "strengths": ["项目叙事完整", "回答结构清楚"],
    "improvements": ["补充量化指标", "准备回滚方案"],
    "next": ["准备系统设计题", "复盘缓存和索引方案"]
  }
}
```

保存接口：

```http
POST /api/ai-summaries
Authorization: Bearer <supabase_access_token>
```

AI 输出约束：

- 只基于用户输入的岗位、面试和回答生成，不编造面试官或公司反馈。
- 输出必须结构化，字段为 `overview`、`strengths`、`improvements`、`next`。
- 生成中按钮禁用，禁止重复提交。
- 失败时展示错误和重试入口。
- 每次调用都写入 `ai_generation_runs`，包括失败记录。

API Key 安全：

- OpenAI 官方建议不要把 API Key 暴露在浏览器或移动端。GoOffer 必须通过服务端代理调用用户 API。
- `api_key` 入库前加密。
- 日志中不得打印完整 key、图片 base64、原始回答全文。
- 用户可更新或删除绑定的 API Key。

参考：

- https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety

## 9. Cloudflare Pages 部署配置

### 9.1 Pages 项目设置

| 配置项 | 值 |
|---|---|
| 部署方式 | Git 集成 |
| 生产分支 | 当前仓库先用 `master` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | 仓库根目录 |
| Node version | `22` |

Cloudflare Pages 环境变量：

```text
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
AI_API_KEY_ENCRYPTION_SECRET=...
APP_BASE_URL=https://gooffer.example.com
APP_ENV=production
```

说明：

- `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 会进入前端构建产物，只能放公开 anon key。
- `SUPABASE_SERVICE_ROLE_KEY` 只能在 Pages Functions 中使用，不得以 `VITE_` 开头。
- `AI_API_KEY_ENCRYPTION_SECRET` 只存在 Cloudflare 环境变量中。

### 9.2 Supabase 项目设置

Supabase 配置：

```text
Project URL
Anon key
Service role key
Auth redirect URLs
Database migrations
Storage bucket: job-screenshots
RLS policies
```

Auth redirect URLs：

```text
https://gooffer.example.com
https://gooffer.example.com/login
https://gooffer.example.com/settings/ai
```

Storage：

- bucket：`job-screenshots`
- access：private
- allowed mime types：`image/png`, `image/jpeg`, `image/webp`
- max file size：10MB

### 9.3 本地开发

```bash
npm install
npm run dev
```

本地 `.env.local`：

```text
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
AI_API_KEY_ENCRYPTION_SECRET=local-dev-secret
```

Supabase CLI：

```bash
supabase start
supabase migration new init_gooffer_schema
supabase db reset
```

Cloudflare Pages Functions 本地调试可使用：

```bash
npx wrangler pages dev dist
```

## 10. 上线步骤

1. 创建 Vite React TypeScript 工程。
2. 把当前 `docs/ui-demo` 的 UI 拆为 React 页面和组件。
3. 接入 Supabase Auth，新增登录、注册、退出、会话恢复。
4. 建立 Supabase migrations，创建业务表、枚举、索引和 RLS policy。
5. 用 Supabase JS 替换前端内存数据。
6. 新增设置页 `/settings/ai`，支持用户绑定、测试、删除 API Key。
7. 新增 Cloudflare Pages Functions：
   - `POST /api/jobs/recognize`
   - `PUT /api/me/ai-provider`
   - `POST /api/me/ai-provider/test`
   - `POST /api/interviews/:interviewId/ai-summary/generate`
8. 接入 AI Prompt 版本、A/B 分组、生成记录和埋点。
9. 配置 Cloudflare Pages 环境变量和 Supabase Auth redirect URLs。
10. 部署 Preview，完成桌面和移动端验证。
11. 绑定正式域名并部署 Production。
12. 上线后观察注册、首个岗位创建、截图识别、AI 总结生成、Offer 对比等核心指标。

## 11. 验收标准

账号与权限：

- 未登录用户访问主应用时跳转登录页。
- 用户登录后只能看到自己的岗位、面试、总结和 Offer。
- RLS 开启后，跨用户查询、更新、删除均失败。

岗位与截图识别：

- 用户可以手动新增、编辑、删除岗位。
- 上传岗位截图后，系统识别并填入岗位表单。
- 用户能修改识别结果后再保存。
- 未绑定 API Key、图片过大、模型不支持视觉时有明确错误提示。

AI 总结：

- 未绑定 API Key 时，引导用户进入设置页。
- API Key 绑定后，前端不能读取明文。
- 有面试问题和回答时，可以生成结构化总结。
- 生成失败会写入失败记录，并允许重试。
- 用户保存后，总结出现在岗位详情页。

Offer 对比：

- 岗位标记为已拿 Offer 后，可补充 Offer 信息。
- 可选择 2-5 个 Offer 横向比较。
- 评分条变化后综合评分实时更新。

部署：

- Preview 和 Production 使用不同 Supabase 环境或明确隔离测试数据。
- Cloudflare Pages 构建成功，静态资源可访问。
- `/api/*` Functions 能校验 Supabase JWT。
- 生产环境没有泄露 service role key、用户 API Key 或完整 AI 输入日志。

## 12. 风险与应对

| 风险 | 应对 |
|---|---|
| RLS 配置遗漏导致数据越权 | 所有表默认开启 RLS；迁移和代码评审检查每张表的 select/insert/update/delete policy。 |
| Supabase service role key 进入前端 | 只有 `VITE_` 前缀变量进入前端；CI 检查 `SUPABASE_SERVICE_ROLE_KEY` 不出现在 `src/`。 |
| 用户 API Key 泄露 | 加密保存；不回显明文；不写日志；删除绑定时清除密文。 |
| BYOK 模型能力不一致 | 保存 `supports_vision`；截图识别前校验；AI 总结使用结构化输出和 Zod fallback。 |
| 图片包含隐私 | 默认不持久化截图；保存时使用 private bucket 和短期 signed URL。 |
| AI 输出质量不稳定 | 复用现有 Prompt A/B Test 方案，记录生成、保存、评分和失败率。 |
| 免费额度或调用成本不稳定 | 用户自带 Key 降低平台成本；仍做每用户频率限制，避免误触和滥用。 |

## 13. 后续扩展

- 支持邮箱找回密码和账号安全设置。
- 支持用户选择不同 AI provider：OpenAI、OpenAI-compatible、自定义 base URL。
- 支持 AI 总结版本历史。
- 支持岗位截图的手动删除和隐私导出。
- 支持导出岗位和 Offer 为 CSV。
- 支持 Supabase Edge Functions 替换 Cloudflare Pages Functions，实现后端逻辑集中到 Supabase。

