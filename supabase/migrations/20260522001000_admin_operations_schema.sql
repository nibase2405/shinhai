create extension if not exists "pgcrypto";

create schema if not exists private;

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add column if not exists status text not null default 'active',
  add column if not exists notes text,
  add column if not exists login_provider text;
alter table public.profiles
  add constraint profiles_role_check check (role in ('user', 'editor', 'admin', 'ads_manager', 'merchant'));
alter table public.profiles drop constraint if exists profiles_status_check;
alter table public.profiles
  add constraint profiles_status_check check (status in ('active', 'suspended'));

alter table public.articles drop constraint if exists articles_status_check;
alter table public.articles
  add constraint articles_status_check check (status in ('draft', 'published', 'scheduled', 'archived'));

alter table public.categories
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists cover_image text,
  add column if not exists sort_order int not null default 0,
  add column if not exists is_active boolean not null default true;

alter table public.attractions
  add column if not exists status text not null default 'published',
  add column if not exists is_hot boolean not null default false,
  add column if not exists is_map_pinned boolean not null default false;
alter table public.attractions drop constraint if exists attractions_status_check;
alter table public.attractions
  add constraint attractions_status_check check (status in ('draft', 'published', 'scheduled', 'archived'));

alter table public.restaurants
  add column if not exists status text not null default 'published',
  add column if not exists is_hot boolean not null default false,
  add column if not exists is_map_pinned boolean not null default false;
alter table public.restaurants drop constraint if exists restaurants_status_check;
alter table public.restaurants
  add constraint restaurants_status_check check (status in ('draft', 'published', 'scheduled', 'archived'));

alter table public.hotels
  add column if not exists status text not null default 'published',
  add column if not exists is_hot boolean not null default false,
  add column if not exists is_map_pinned boolean not null default false,
  add column if not exists klook_stay_url text;
alter table public.hotels drop constraint if exists hotels_status_check;
alter table public.hotels
  add constraint hotels_status_check check (status in ('draft', 'published', 'scheduled', 'archived'));

alter table public.affiliate_links drop constraint if exists affiliate_links_provider_check;
alter table public.affiliate_links
  add constraint affiliate_links_provider_check check (provider in ('agoda', 'booking', 'klook', 'kkday', 'trip', 'custom'));
alter table public.affiliate_links drop constraint if exists affiliate_links_type_check;
alter table public.affiliate_links
  add constraint affiliate_links_type_check check (type in ('hotel', 'ticket', 'food', 'tour', 'transport'));
alter table public.affiliate_links
  add column if not exists sort_order int not null default 0,
  add column if not exists conversion_note text,
  add column if not exists auto_rule_json jsonb not null default '{}'::jsonb;

alter table public.ads
  add column if not exists starts_at timestamptz,
  add column if not exists ends_at timestamptz,
  add column if not exists click_count int not null default 0,
  add column if not exists impression_count int not null default 0,
  add column if not exists sort_order int not null default 0;

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  type text not null default 'shared',
  seo_title text,
  seo_description text,
  cover_image text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt_text text,
  title text,
  category text,
  mime_type text,
  size_bytes bigint,
  used_in jsonb not null default '[]'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.ad_clicks (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid references public.ads(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  ip_hash text,
  referrer text,
  user_agent text,
  clicked_at timestamptz not null default now()
);

create table if not exists public.merchants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  name text not null,
  merchant_type text,
  address text,
  phone text,
  image_url text,
  cooperation_status text not null default 'pending' check (cooperation_status in ('pending', 'active', 'paused', 'ended')),
  plan text,
  ad_start_at timestamptz,
  ad_end_at timestamptz,
  related_type text check (related_type in ('article', 'attraction', 'restaurant', 'hotel')),
  related_id uuid,
  is_map_pinned boolean not null default false,
  is_home_featured boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.redirects (
  id uuid primary key default gen_random_uuid(),
  source_path text not null unique,
  target_url text not null,
  status_code int not null default 301 check (status_code in (301, 302, 307, 308)),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  target_type text,
  target_id uuid,
  user_id uuid references auth.users(id) on delete set null,
  session_id text,
  referrer text,
  user_agent text,
  viewed_at timestamptz not null default now()
);

create table if not exists public.import_logs (
  id uuid primary key default gen_random_uuid(),
  resource_type text not null,
  file_name text,
  status text not null default 'pending' check (status in ('pending', 'running', 'success', 'failed')),
  total_rows int not null default 0,
  success_count int not null default 0,
  error_count int not null default 0,
  error_detail jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  table_name text not null,
  record_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.content_relations (
  id uuid primary key default gen_random_uuid(),
  source_type text not null check (source_type in ('article', 'attraction', 'restaurant', 'hotel', 'merchant')),
  source_id uuid not null,
  target_type text not null check (target_type in ('article', 'attraction', 'restaurant', 'hotel', 'merchant', 'ad', 'affiliate_link')),
  target_id uuid not null,
  relation_type text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique(source_type, source_id, target_type, target_id, relation_type)
);

create table if not exists public.map_markers (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('attraction', 'restaurant', 'hotel', 'merchant', 'custom')),
  target_id uuid,
  name text not null,
  category text,
  marker_icon text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  is_visible boolean not null default true,
  is_map_pinned boolean not null default false,
  is_paid_promoted boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tags_type_sort_idx on public.tags(type, sort_order);
create index if not exists media_assets_category_idx on public.media_assets(category);
create index if not exists ad_clicks_ad_clicked_idx on public.ad_clicks(ad_id, clicked_at desc);
create index if not exists merchants_owner_idx on public.merchants(owner_id);
create index if not exists redirects_source_path_idx on public.redirects(source_path);
create index if not exists page_views_path_viewed_idx on public.page_views(path, viewed_at desc);
create index if not exists page_views_target_viewed_idx on public.page_views(target_type, target_id, viewed_at desc);
create index if not exists audit_logs_table_record_idx on public.audit_logs(table_name, record_id, created_at desc);
create index if not exists content_relations_source_idx on public.content_relations(source_type, source_id, relation_type);
create index if not exists map_markers_visible_idx on public.map_markers(is_visible, target_type);

drop trigger if exists merchants_set_updated_at on public.merchants;
create trigger merchants_set_updated_at
before update on public.merchants
for each row execute function public.set_updated_at();

drop trigger if exists map_markers_set_updated_at on public.map_markers;
create trigger map_markers_set_updated_at
before update on public.map_markers
for each row execute function public.set_updated_at();

create or replace function private.current_user_has_role(allowed_roles text[])
returns boolean
language sql
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and status = 'active'
      and role = any(allowed_roles)
  );
$$;

create or replace function private.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  changed_id uuid;
begin
  if tg_op = 'DELETE' then
    changed_id := (to_jsonb(old) ->> 'id')::uuid;
  else
    changed_id := (to_jsonb(new) ->> 'id')::uuid;
  end if;

  insert into public.audit_logs (actor_id, action, table_name, record_id, before_data, after_data)
  values (
    auth.uid(),
    lower(tg_op),
    tg_table_name,
    changed_id,
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end
  );

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'articles',
    'attractions',
    'restaurants',
    'hotels',
    'affiliate_links',
    'ads',
    'categories',
    'tags',
    'media_assets',
    'merchants',
    'redirects',
    'site_settings',
    'map_markers'
  ]
  loop
    execute format('drop trigger if exists %I on public.%I', table_name || '_audit', table_name);
    execute format(
      'create trigger %I after insert or update or delete on public.%I for each row execute function private.audit_row_change()',
      table_name || '_audit',
      table_name
    );
  end loop;
end $$;

grant usage on schema public to anon, authenticated, service_role;
grant usage on schema private to authenticated, service_role;
grant execute on function private.current_user_has_role(text[]) to authenticated, service_role;
grant execute on function private.audit_row_change() to service_role;

grant select on public.tags to anon, authenticated;
grant select on public.media_assets to anon, authenticated;
grant select on public.redirects to anon, authenticated;
grant insert on public.page_views to anon, authenticated;
grant select, insert, update, delete on public.tags to authenticated;
grant select, insert, update, delete on public.media_assets to authenticated;
grant select, insert, update, delete on public.ad_clicks to authenticated;
grant select, insert, update, delete on public.merchants to authenticated;
grant select, insert, update, delete on public.redirects to authenticated;
grant select, insert, update, delete on public.site_settings to authenticated;
grant select, insert, update, delete on public.import_logs to authenticated;
grant select on public.audit_logs to authenticated;
grant select, insert, update, delete on public.content_relations to authenticated;
grant select, insert, update, delete on public.map_markers to authenticated;
grant select, insert, update, delete on all tables in schema public to service_role;

alter table public.tags enable row level security;
alter table public.media_assets enable row level security;
alter table public.ad_clicks enable row level security;
alter table public.merchants enable row level security;
alter table public.redirects enable row level security;
alter table public.site_settings enable row level security;
alter table public.page_views enable row level security;
alter table public.import_logs enable row level security;
alter table public.audit_logs enable row level security;
alter table public.content_relations enable row level security;
alter table public.map_markers enable row level security;

drop policy if exists "Admins manage articles" on public.articles;
drop policy if exists "Admins manage attractions" on public.attractions;
drop policy if exists "Admins manage restaurants" on public.restaurants;
drop policy if exists "Admins manage hotels" on public.hotels;
drop policy if exists "Attractions readable" on public.attractions;
drop policy if exists "Restaurants readable" on public.restaurants;
drop policy if exists "Hotels readable" on public.hotels;
drop policy if exists "Categories readable" on public.categories;
drop policy if exists "Admins manage categories" on public.categories;
drop policy if exists "Admins manage affiliate links" on public.affiliate_links;
drop policy if exists "Admins manage ads" on public.ads;
drop policy if exists "Active ads readable" on public.ads;
drop policy if exists "Admins read affiliate clicks" on public.affiliate_clicks;

create policy "Content roles manage articles"
on public.articles
for all
to authenticated
using (private.current_user_has_role(array['admin', 'editor']))
with check (private.current_user_has_role(array['admin', 'editor']));

create policy "Published attractions readable"
on public.attractions
for select
to anon, authenticated
using (status = 'published');

create policy "Content roles manage attractions"
on public.attractions
for all
to authenticated
using (private.current_user_has_role(array['admin', 'editor']))
with check (private.current_user_has_role(array['admin', 'editor']));

create policy "Published restaurants readable"
on public.restaurants
for select
to anon, authenticated
using (status = 'published');

create policy "Content roles manage restaurants"
on public.restaurants
for all
to authenticated
using (private.current_user_has_role(array['admin', 'editor']))
with check (private.current_user_has_role(array['admin', 'editor']));

create policy "Published hotels readable"
on public.hotels
for select
to anon, authenticated
using (status = 'published');

create policy "Content roles manage hotels"
on public.hotels
for all
to authenticated
using (private.current_user_has_role(array['admin', 'editor']))
with check (private.current_user_has_role(array['admin', 'editor']));

create policy "Taxonomy roles manage categories"
on public.categories
for all
to authenticated
using (private.current_user_has_role(array['admin', 'editor']))
with check (private.current_user_has_role(array['admin', 'editor']));

create policy "Active categories readable"
on public.categories
for select
to anon, authenticated
using (is_active = true);

create policy "Active tags readable"
on public.tags
for select
to anon, authenticated
using (is_active = true);

create policy "Taxonomy roles manage tags"
on public.tags
for all
to authenticated
using (private.current_user_has_role(array['admin', 'editor']))
with check (private.current_user_has_role(array['admin', 'editor']));

create policy "Public media readable"
on public.media_assets
for select
to anon, authenticated
using (true);

create policy "Media roles manage media"
on public.media_assets
for all
to authenticated
using (private.current_user_has_role(array['admin', 'editor']))
with check (private.current_user_has_role(array['admin', 'editor']));

create policy "Affiliate roles manage affiliate links"
on public.affiliate_links
for all
to authenticated
using (private.current_user_has_role(array['admin', 'ads_manager']))
with check (private.current_user_has_role(array['admin', 'ads_manager']));

create policy "Affiliate roles read clicks"
on public.affiliate_clicks
for select
to authenticated
using (private.current_user_has_role(array['admin', 'ads_manager']));

create policy "Affiliate roles read ad clicks"
on public.ad_clicks
for select
to authenticated
using (private.current_user_has_role(array['admin', 'ads_manager']));

create policy "Affiliate roles insert ad clicks"
on public.ad_clicks
for insert
to anon, authenticated
with check (true);

create policy "Ads roles manage ads"
on public.ads
for all
to authenticated
using (private.current_user_has_role(array['admin', 'ads_manager']))
with check (private.current_user_has_role(array['admin', 'ads_manager']));

create policy "Active ads with schedule readable"
on public.ads
for select
to anon, authenticated
using (
  is_active = true
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
);

create policy "Merchants readable when active"
on public.merchants
for select
to anon, authenticated
using (cooperation_status = 'active');

create policy "Merchant owners manage own merchants"
on public.merchants
for all
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "Merchant roles manage merchants"
on public.merchants
for all
to authenticated
using (private.current_user_has_role(array['admin', 'ads_manager']))
with check (private.current_user_has_role(array['admin', 'ads_manager']));

create policy "Active redirects readable"
on public.redirects
for select
to anon, authenticated
using (is_active = true);

create policy "Seo roles manage redirects"
on public.redirects
for all
to authenticated
using (private.current_user_has_role(array['admin', 'editor']))
with check (private.current_user_has_role(array['admin', 'editor']));

create policy "Settings admins manage"
on public.site_settings
for all
to authenticated
using (private.current_user_has_role(array['admin']))
with check (private.current_user_has_role(array['admin']));

create policy "Anyone can insert page views"
on public.page_views
for insert
to anon, authenticated
with check (true);

create policy "Admins read page views"
on public.page_views
for select
to authenticated
using (private.current_user_has_role(array['admin', 'editor', 'ads_manager']));

create policy "Import roles manage logs"
on public.import_logs
for all
to authenticated
using (private.current_user_has_role(array['admin', 'editor']))
with check (private.current_user_has_role(array['admin', 'editor']));

create policy "Admins read audit logs"
on public.audit_logs
for select
to authenticated
using (private.current_user_has_role(array['admin']));

create policy "Content roles manage content relations"
on public.content_relations
for all
to authenticated
using (private.current_user_has_role(array['admin', 'editor', 'ads_manager']))
with check (private.current_user_has_role(array['admin', 'editor', 'ads_manager']));

create policy "Visible map markers readable"
on public.map_markers
for select
to anon, authenticated
using (is_visible = true);

create policy "Map roles manage markers"
on public.map_markers
for all
to authenticated
using (private.current_user_has_role(array['admin', 'editor', 'merchant']))
with check (private.current_user_has_role(array['admin', 'editor', 'merchant']));
