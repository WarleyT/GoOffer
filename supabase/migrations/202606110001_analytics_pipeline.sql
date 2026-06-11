alter table public.analytics_events
  add column if not exists client_event_id uuid,
  add column if not exists visitor_id text,
  add column if not exists session_id text,
  add column if not exists page_path text,
  add column if not exists referrer text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists event_source text not null default 'client',
  add column if not exists country text,
  add column if not exists event_version integer not null default 1;

create unique index if not exists analytics_events_client_event_id_idx
  on public.analytics_events (client_event_id);

create index if not exists analytics_events_name_time_idx
  on public.analytics_events (event_name, created_at desc);

create index if not exists analytics_events_user_time_idx
  on public.analytics_events (user_id, created_at desc);

create index if not exists analytics_events_visitor_time_idx
  on public.analytics_events (visitor_id, created_at desc);

create schema if not exists analytics_private;

revoke all on schema analytics_private from public, anon, authenticated;
grant usage on schema analytics_private to service_role;

create or replace view analytics_private.event_daily as
select
  created_at::date as metric_date,
  event_name,
  count(*) as event_count,
  count(distinct user_id) as user_count,
  count(distinct visitor_id) as visitor_count
from public.analytics_events
group by created_at::date, event_name;

create or replace view analytics_private.registration_funnel_daily as
with traffic as (
  select
    created_at::date as metric_date,
    count(distinct visitor_id)
      filter (where event_name = 'landing_viewed') as visitors,
    count(distinct visitor_id)
      filter (where event_name = 'signup_started') as signup_started
  from public.analytics_events
  group by created_at::date
),
signups as (
  select
    created_at::date as metric_date,
    count(*) as signup_succeeded
  from public.profiles
  group by created_at::date
)
select
  coalesce(traffic.metric_date, signups.metric_date) as metric_date,
  coalesce(traffic.visitors, 0) as visitors,
  coalesce(traffic.signup_started, 0) as signup_started,
  coalesce(signups.signup_succeeded, 0) as signup_succeeded,
  round(
    coalesce(signups.signup_succeeded, 0)::numeric
    / nullif(coalesce(traffic.visitors, 0), 0),
    4
  ) as visit_to_signup_rate,
  round(
    coalesce(signups.signup_succeeded, 0)::numeric
    / nullif(coalesce(traffic.signup_started, 0), 0),
    4
  ) as signup_completion_rate
from traffic
full join signups on signups.metric_date = traffic.metric_date;

create or replace view analytics_private.feature_funnel_30d as
with cohort as (
  select id as user_id
  from public.profiles
  where created_at >= now() - interval '30 days'
),
stage_counts as (
  select
    count(*) as signed_up,
    count(*) filter (
      where exists (select 1 from public.jobs where jobs.user_id = cohort.user_id)
    ) as created_job,
    count(*) filter (
      where exists (select 1 from public.interviews where interviews.user_id = cohort.user_id)
    ) as created_interview,
    count(*) filter (
      where exists (select 1 from public.user_ai_providers where user_ai_providers.user_id = cohort.user_id)
    ) as provider_saved,
    count(*) filter (
      where exists (
        select 1
        from public.analytics_events
        where analytics_events.user_id = cohort.user_id
          and analytics_events.event_name = 'ai_provider_test_succeeded'
      )
    ) as provider_tested,
    count(*) filter (
      where exists (
        select 1
        from public.ai_generation_runs
        where ai_generation_runs.user_id = cohort.user_id
          and ai_generation_runs.status = 'success'
      )
    ) as summary_generated,
    count(*) filter (
      where exists (select 1 from public.ai_summaries where ai_summaries.user_id = cohort.user_id)
    ) as summary_saved,
    count(*) filter (
      where exists (select 1 from public.offers where offers.user_id = cohort.user_id)
    ) as offer_created
  from cohort
)
select
  *,
  round(created_job::numeric / nullif(signed_up, 0), 4) as signup_to_job_rate,
  round(created_interview::numeric / nullif(created_job, 0), 4) as job_to_interview_rate,
  round(provider_tested::numeric / nullif(provider_saved, 0), 4) as provider_validation_rate,
  round(summary_generated::numeric / nullif(provider_tested, 0), 4) as provider_to_summary_rate,
  round(summary_saved::numeric / nullif(summary_generated, 0), 4) as summary_save_rate
from stage_counts;

create or replace view analytics_private.api_binding_overview as
with totals as (
  select
    (select count(*) from auth.users) as registered_users,
    (select count(distinct user_id) from public.user_ai_providers) as api_bound_users,
    (
      select count(distinct user_id)
      from public.analytics_events
      where event_name = 'ai_provider_test_succeeded'
    ) as api_valid_users,
    (
      select count(distinct user_id)
      from public.ai_generation_runs
      where status = 'success'
    ) as ai_active_users
)
select
  *,
  round(api_bound_users::numeric / nullif(registered_users, 0), 4) as api_bind_rate,
  round(api_valid_users::numeric / nullif(api_bound_users, 0), 4) as api_valid_rate,
  round(ai_active_users::numeric / nullif(api_valid_users, 0), 4) as ai_activation_rate
from totals;

create or replace view analytics_private.click_through_30d as
with pairs as (
  select *
  from (
    values
      ('add_job', 'add_job_cta_viewed', 'job_create_clicked'),
      ('ai_summary', 'ai_summary_entry_viewed', 'ai_summary_requested'),
      ('ai_provider', 'ai_provider_page_viewed', 'ai_provider_save_clicked'),
      ('offer_compare', 'offer_compare_entry_viewed', 'offer_compare_entry_clicked')
  ) as values_table(metric, impression_event, click_event)
),
event_counts as (
  select event_name, count(*) as event_count
  from public.analytics_events
  where created_at >= now() - interval '30 days'
  group by event_name
)
select
  pairs.metric,
  coalesce(impressions.event_count, 0) as impressions,
  coalesce(clicks.event_count, 0) as clicks,
  round(
    coalesce(clicks.event_count, 0)::numeric
    / nullif(coalesce(impressions.event_count, 0), 0),
    4
  ) as ctr
from pairs
left join event_counts impressions on impressions.event_name = pairs.impression_event
left join event_counts clicks on clicks.event_name = pairs.click_event;

grant select on all tables in schema analytics_private to service_role;
