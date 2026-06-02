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
