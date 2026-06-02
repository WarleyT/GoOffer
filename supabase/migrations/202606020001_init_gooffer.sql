create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'job_status') then
    create type public.job_status as enum ('待投递', '已投递', '面试中', '已拿Offer', '被拒绝', '已放弃');
  end if;
  if not exists (select 1 from pg_type where typname = 'job_priority') then
    create type public.job_priority as enum ('高', '中', '低');
  end if;
  if not exists (select 1 from pg_type where typname = 'interview_result') then
    create type public.interview_result as enum ('待面试', '等待结果', '失败', '通过');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company text not null,
  title text not null,
  city text,
  salary_amount text,
  salary_unit text check (salary_unit in ('k', 'w')),
  salary_display text,
  source text,
  priority public.job_priority not null default '中',
  status public.job_status not null default '待投递',
  tags text[] not null default '{}',
  description text,
  logo text,
  logo_tone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.interviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  round_label text not null,
  round_name text,
  time timestamptz,
  duration_minutes integer,
  result public.interview_result not null default '待面试',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.interview_questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  interview_id uuid not null references public.interviews(id) on delete cascade,
  question text,
  answer text,
  created_at timestamptz not null default now()
);

create table if not exists public.offers (
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

create table if not exists public.ai_summaries (
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

create table if not exists public.user_ai_providers (
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

create table if not exists public.prompt_versions (
  id text primary key,
  name text not null,
  prompt_text text not null,
  model text,
  temperature numeric not null default 0.3,
  output_schema jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_generation_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete set null,
  interview_id uuid references public.interviews(id) on delete set null,
  prompt_version_id text references public.prompt_versions(id),
  input_snapshot jsonb not null default '{}'::jsonb,
  output_json jsonb,
  latency_ms integer,
  token_input integer,
  token_output integer,
  status text not null check (status in ('success', 'failed')),
  error_code text,
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_name text not null,
  entity_type text,
  entity_id uuid,
  properties jsonb,
  created_at timestamptz not null default now()
);

insert into public.prompt_versions (id, name, prompt_text, temperature, output_schema)
values (
  'ai_summary_action_v1',
  '行动导向型面试复盘',
  '你是求职面试复盘助手。只基于用户提供的岗位、面试和问答内容，输出具体、可行动、结构清晰的中文复盘。不要编造面试官反馈或公司信息。',
  0.3,
  '{"type":"object","required":["overview","strengths","improvements","next"],"properties":{"overview":{"type":"string"},"strengths":{"type":"array","items":{"type":"string"}},"improvements":{"type":"array","items":{"type":"string"}},"next":{"type":"array","items":{"type":"string"}}}}'::jsonb
)
on conflict (id) do nothing;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_jobs_updated_at on public.jobs;
create trigger set_jobs_updated_at before update on public.jobs
for each row execute function public.set_updated_at();

drop trigger if exists set_interviews_updated_at on public.interviews;
create trigger set_interviews_updated_at before update on public.interviews
for each row execute function public.set_updated_at();

drop trigger if exists set_offers_updated_at on public.offers;
create trigger set_offers_updated_at before update on public.offers
for each row execute function public.set_updated_at();

drop trigger if exists set_user_ai_providers_updated_at on public.user_ai_providers;
create trigger set_user_ai_providers_updated_at before update on public.user_ai_providers
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.interviews enable row level security;
alter table public.interview_questions enable row level security;
alter table public.offers enable row level security;
alter table public.ai_summaries enable row level security;
alter table public.user_ai_providers enable row level security;
alter table public.ai_generation_runs enable row level security;
alter table public.analytics_events enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "jobs_select_own" on public.jobs;
create policy "jobs_select_own" on public.jobs for select using (auth.uid() = user_id);
drop policy if exists "jobs_insert_own" on public.jobs;
create policy "jobs_insert_own" on public.jobs for insert with check (auth.uid() = user_id);
drop policy if exists "jobs_update_own" on public.jobs;
create policy "jobs_update_own" on public.jobs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "jobs_delete_own" on public.jobs;
create policy "jobs_delete_own" on public.jobs for delete using (auth.uid() = user_id);

drop policy if exists "interviews_select_own" on public.interviews;
create policy "interviews_select_own" on public.interviews for select using (auth.uid() = user_id);
drop policy if exists "interviews_insert_own" on public.interviews;
create policy "interviews_insert_own" on public.interviews for insert with check (auth.uid() = user_id);
drop policy if exists "interviews_update_own" on public.interviews;
create policy "interviews_update_own" on public.interviews for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "interviews_delete_own" on public.interviews;
create policy "interviews_delete_own" on public.interviews for delete using (auth.uid() = user_id);

drop policy if exists "interview_questions_select_own" on public.interview_questions;
create policy "interview_questions_select_own" on public.interview_questions for select using (auth.uid() = user_id);
drop policy if exists "interview_questions_insert_own" on public.interview_questions;
create policy "interview_questions_insert_own" on public.interview_questions for insert with check (auth.uid() = user_id);
drop policy if exists "interview_questions_update_own" on public.interview_questions;
create policy "interview_questions_update_own" on public.interview_questions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "interview_questions_delete_own" on public.interview_questions;
create policy "interview_questions_delete_own" on public.interview_questions for delete using (auth.uid() = user_id);

drop policy if exists "offers_select_own" on public.offers;
create policy "offers_select_own" on public.offers for select using (auth.uid() = user_id);
drop policy if exists "offers_insert_own" on public.offers;
create policy "offers_insert_own" on public.offers for insert with check (auth.uid() = user_id);
drop policy if exists "offers_update_own" on public.offers;
create policy "offers_update_own" on public.offers for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "offers_delete_own" on public.offers;
create policy "offers_delete_own" on public.offers for delete using (auth.uid() = user_id);

drop policy if exists "ai_summaries_select_own" on public.ai_summaries;
create policy "ai_summaries_select_own" on public.ai_summaries for select using (auth.uid() = user_id);
drop policy if exists "ai_summaries_insert_own" on public.ai_summaries;
create policy "ai_summaries_insert_own" on public.ai_summaries for insert with check (auth.uid() = user_id);
drop policy if exists "ai_summaries_delete_own" on public.ai_summaries;
create policy "ai_summaries_delete_own" on public.ai_summaries for delete using (auth.uid() = user_id);

drop policy if exists "user_ai_providers_select_own" on public.user_ai_providers;
create policy "user_ai_providers_select_own" on public.user_ai_providers for select using (auth.uid() = user_id);
drop policy if exists "user_ai_providers_insert_own" on public.user_ai_providers;
create policy "user_ai_providers_insert_own" on public.user_ai_providers for insert with check (auth.uid() = user_id);
drop policy if exists "user_ai_providers_update_own" on public.user_ai_providers;
create policy "user_ai_providers_update_own" on public.user_ai_providers for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "user_ai_providers_delete_own" on public.user_ai_providers;
create policy "user_ai_providers_delete_own" on public.user_ai_providers for delete using (auth.uid() = user_id);

drop policy if exists "ai_generation_runs_select_own" on public.ai_generation_runs;
create policy "ai_generation_runs_select_own" on public.ai_generation_runs for select using (auth.uid() = user_id);

drop policy if exists "analytics_events_insert_own" on public.analytics_events;
create policy "analytics_events_insert_own" on public.analytics_events for insert with check (auth.uid() = user_id);

grant usage on schema public to anon, authenticated, service_role;

grant select on public.prompt_versions to authenticated, service_role;

grant select, insert, update, delete on public.profiles to authenticated, service_role;
grant select, insert, update, delete on public.jobs to authenticated, service_role;
grant select, insert, update, delete on public.interviews to authenticated, service_role;
grant select, insert, update, delete on public.interview_questions to authenticated, service_role;
grant select, insert, update, delete on public.offers to authenticated, service_role;
grant select, insert, update, delete on public.ai_summaries to authenticated, service_role;
grant select, insert, update, delete on public.user_ai_providers to authenticated, service_role;
grant select, insert, update, delete on public.ai_generation_runs to authenticated, service_role;
grant select, insert on public.analytics_events to authenticated, service_role;

create index if not exists jobs_user_id_updated_at_idx on public.jobs (user_id, updated_at desc);
create index if not exists interviews_job_id_idx on public.interviews (job_id);
create index if not exists interview_questions_interview_id_idx on public.interview_questions (interview_id);
create index if not exists offers_user_id_idx on public.offers (user_id);
create index if not exists ai_summaries_job_id_idx on public.ai_summaries (job_id);
