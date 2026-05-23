alter table public.affiliate_links drop constraint if exists affiliate_links_provider_check;
alter table public.affiliate_links
  add constraint affiliate_links_provider_check check (provider in ('agoda', 'booking', 'klook', 'kkday', 'trip', 'travelpayouts', 'custom'));

alter table public.affiliate_links
  add column if not exists original_url text,
  add column if not exists sub_id text,
  add column if not exists external_meta jsonb not null default '{}'::jsonb;

insert into public.site_settings (key, value)
values
  ('travelpayouts_defaults', '{"marker":"","trs":"","shorten":true}'::jsonb)
on conflict (key) do nothing;
