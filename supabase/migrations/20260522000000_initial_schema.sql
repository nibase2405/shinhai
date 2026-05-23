create extension if not exists "pgcrypto";

create schema if not exists private;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  type text not null check (type in ('article', 'attraction', 'food', 'hotel')),
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image text,
  category_id uuid references public.categories(id) on delete set null,
  tags text[] not null default '{}',
  author_id uuid references public.profiles(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  seo_title text,
  seo_description text,
  og_image text,
  schema_faq_json jsonb,
  view_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.attractions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  english_name text,
  description text,
  address text,
  district text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  opening_hours text,
  ticket_price text,
  transport_info text,
  cover_image text,
  gallery text[] not null default '{}',
  category text,
  tags text[] not null default '{}',
  rating numeric(2, 1),
  is_featured boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  address text,
  district text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  phone text,
  opening_hours text,
  average_price int,
  cuisine_type text,
  cover_image text,
  gallery text[] not null default '{}',
  menu_images text[] not null default '{}',
  rating numeric(2, 1),
  is_featured boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hotels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  address text,
  district text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  star_rating int check (star_rating between 1 and 5),
  price_range text,
  cover_image text,
  gallery text[] not null default '{}',
  rating numeric(2, 1),
  agoda_url text,
  booking_url text,
  trip_url text,
  is_featured boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.affiliate_links (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  provider text not null check (provider in ('agoda', 'booking', 'klook', 'trip')),
  type text not null check (type in ('hotel', 'ticket', 'food', 'tour')),
  related_type text check (related_type in ('article', 'attraction', 'restaurant', 'hotel')),
  related_id uuid,
  url text not null,
  commission_note text,
  is_active boolean not null default true,
  click_count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  affiliate_link_id uuid references public.affiliate_links(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  ip_hash text,
  referrer text,
  user_agent text,
  clicked_at timestamptz not null default now()
);

create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  placement text not null,
  size text not null,
  ad_type text not null check (ad_type in ('adsense', 'direct')),
  adsense_slot text,
  image_url text,
  target_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('article', 'attraction', 'restaurant', 'hotel')),
  target_id uuid not null,
  created_at timestamptz not null default now(),
  unique(user_id, target_type, target_id)
);

create index if not exists articles_status_published_at_idx on public.articles(status, published_at desc);
create index if not exists articles_category_id_idx on public.articles(category_id);
create index if not exists attractions_district_idx on public.attractions(district);
create index if not exists restaurants_district_idx on public.restaurants(district);
create index if not exists hotels_district_idx on public.hotels(district);
create index if not exists affiliate_clicks_link_clicked_idx on public.affiliate_clicks(affiliate_link_id, clicked_at desc);
create index if not exists favorites_user_target_idx on public.favorites(user_id, target_type);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

drop trigger if exists attractions_set_updated_at on public.attractions;
create trigger attractions_set_updated_at
before update on public.attractions
for each row execute function public.set_updated_at();

drop trigger if exists restaurants_set_updated_at on public.restaurants;
create trigger restaurants_set_updated_at
before update on public.restaurants
for each row execute function public.set_updated_at();

drop trigger if exists hotels_set_updated_at on public.hotels;
create trigger hotels_set_updated_at
before update on public.hotels
for each row execute function public.set_updated_at();

create or replace function private.current_user_is_admin()
returns boolean
language sql
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

grant usage on schema public to anon, authenticated, service_role;
grant usage on schema private to authenticated, service_role;
grant execute on function private.current_user_is_admin() to authenticated, service_role;

grant select on public.categories to anon, authenticated;
grant select on public.articles to anon, authenticated;
grant select on public.attractions to anon, authenticated;
grant select on public.restaurants to anon, authenticated;
grant select on public.hotels to anon, authenticated;
grant select on public.affiliate_links to anon, authenticated;
grant select on public.ads to anon, authenticated;
grant select, insert, update, delete on public.favorites to authenticated;
grant select, insert, update, delete on all tables in schema public to service_role;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.articles enable row level security;
alter table public.attractions enable row level security;
alter table public.restaurants enable row level security;
alter table public.hotels enable row level security;
alter table public.affiliate_links enable row level security;
alter table public.affiliate_clicks enable row level security;
alter table public.ads enable row level security;
alter table public.favorites enable row level security;

create policy "Profiles are readable by owner or admin"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id or private.current_user_is_admin());

create policy "Users update own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id and role = 'user');

create policy "Admins manage profiles"
on public.profiles
for all
to authenticated
using (private.current_user_is_admin())
with check (private.current_user_is_admin());

create policy "Categories readable"
on public.categories
for select
to anon, authenticated
using (true);

create policy "Admins manage categories"
on public.categories
for all
to authenticated
using (private.current_user_is_admin())
with check (private.current_user_is_admin());

create policy "Published articles readable"
on public.articles
for select
to anon, authenticated
using (status = 'published');

create policy "Admins manage articles"
on public.articles
for all
to authenticated
using (private.current_user_is_admin())
with check (private.current_user_is_admin());

create policy "Attractions readable"
on public.attractions
for select
to anon, authenticated
using (true);

create policy "Admins manage attractions"
on public.attractions
for all
to authenticated
using (private.current_user_is_admin())
with check (private.current_user_is_admin());

create policy "Restaurants readable"
on public.restaurants
for select
to anon, authenticated
using (true);

create policy "Admins manage restaurants"
on public.restaurants
for all
to authenticated
using (private.current_user_is_admin())
with check (private.current_user_is_admin());

create policy "Hotels readable"
on public.hotels
for select
to anon, authenticated
using (true);

create policy "Admins manage hotels"
on public.hotels
for all
to authenticated
using (private.current_user_is_admin())
with check (private.current_user_is_admin());

create policy "Active affiliate links readable"
on public.affiliate_links
for select
to anon, authenticated
using (is_active = true);

create policy "Admins manage affiliate links"
on public.affiliate_links
for all
to authenticated
using (private.current_user_is_admin())
with check (private.current_user_is_admin());

create policy "Admins read affiliate clicks"
on public.affiliate_clicks
for select
to authenticated
using (private.current_user_is_admin());

create policy "Active ads readable"
on public.ads
for select
to anon, authenticated
using (is_active = true);

create policy "Admins manage ads"
on public.ads
for all
to authenticated
using (private.current_user_is_admin())
with check (private.current_user_is_admin());

create policy "Users read own favorites"
on public.favorites
for select
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Users insert own favorites"
on public.favorites
for insert
to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Users delete own favorites"
on public.favorites
for delete
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Admins manage favorites"
on public.favorites
for all
to authenticated
using (private.current_user_is_admin())
with check (private.current_user_is_admin());
