alter table public.offers
  add column if not exists custom_dimensions jsonb not null default '[]'::jsonb;

alter table public.offers
  drop constraint if exists offers_custom_dimensions_array_check;

alter table public.offers
  add constraint offers_custom_dimensions_array_check
  check (jsonb_typeof(custom_dimensions) = 'array');
