-- tteok's Memory Room
-- 在 Supabase SQL Editor 执行本文件。
-- 不需要登录。谁打开网页，谁就能改。

create extension if not exists "pgcrypto";

create table public.users (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('owner', 'friend')),
  display_name text not null default 'tteok',
  bio text not null default '这里是 tteok 的记忆小窝。请随便坐。',
  mood text not null default '今天想吃年糕',
  listening text not null default 'BGM',
  eating text not null default '年糕',
  weather text not null default '晴 ★',
  location text not null default 'memory room',
  doing text not null default '慢慢翻旧照片',
  sticker text not null default '喜欢这里 (positive)',
  useless_note text not null default 'guestbook is open',
  avatar_url text,
  site_title text not null default 'tteok''s Memory Room',
  hit_count bigint not null default 0,
  today_count int not null default 0,
  today_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  body text not null default '',
  cover_path text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  caption text not null default '',
  created_by uuid references public.users (id) on delete set null,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.comments (id) on delete cascade,
  nickname text not null,
  body text not null,
  created_by uuid references public.users (id) on delete set null,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.music (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null unique check (platform in ('instagram', 'x', 'tiktok', 'youtube')),
  url text,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table public.moments (
  id uuid primary key default gen_random_uuid(),
  body text not null default '',
  image_paths text[] not null default '{}',
  created_by uuid references public.users (id) on delete set null,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now()
);

insert into public.social_links (platform, url, sort_order) values
  ('instagram', null, 0),
  ('x', null, 1),
  ('tiktok', null, 2),
  ('youtube', null, 3)
on conflict (platform) do nothing;

alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.photos enable row level security;
alter table public.comments enable row level security;
alter table public.music enable row level security;
alter table public.social_links enable row level security;
alter table public.moments enable row level security;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid()
      and role in ('owner', 'friend')
  );
$$;

create or replace function public.increment_hit_count()
returns table(hit_count bigint, today_count int)
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.users
  set
    hit_count = users.hit_count + 1,
    today_count = case
      when users.today_date = current_date then users.today_count + 1
      else 1
    end,
    today_date = current_date,
    updated_at = now()
  where role = 'owner';

  if not found then
    update public.users
    set
      hit_count = users.hit_count + 1,
      today_count = case
        when users.today_date = current_date then users.today_count + 1
        else 1
      end,
      today_date = current_date,
      updated_at = now();
  end if;

  return query
    select u.hit_count, u.today_count
    from public.users u
    order by case when u.role = 'owner' then 0 else 1 end
    limit 1;
end;
$$;

grant execute on function public.is_staff() to anon, authenticated;
grant execute on function public.increment_hit_count() to anon, authenticated;

create policy "users public read" on public.users
  for select using (true);

create policy "anyone write users" on public.users
  for all using (true) with check (true);

create policy "posts public" on public.posts
  for select using (true);

create policy "anyone write posts" on public.posts
  for all using (true) with check (true);

create policy "photos public" on public.photos
  for select using (true);

create policy "anyone write photos" on public.photos
  for all using (true) with check (true);

create policy "comments public" on public.comments
  for select using (true);

create policy "anyone insert comments" on public.comments
  for insert with check (
    char_length(trim(nickname)) between 1 and 24
    and char_length(trim(body)) between 1 and 500
  );

create policy "anyone update comments" on public.comments
  for update using (true) with check (true);

create policy "anyone delete comments" on public.comments
  for delete using (true);

create policy "music public" on public.music
  for select using (true);

create policy "anyone write music" on public.music
  for all using (true) with check (true);

create policy "social links public" on public.social_links
  for select using (true);

create policy "anyone write social links" on public.social_links
  for all using (true) with check (true);

create policy "moments public" on public.moments
  for select using (true);

create policy "anyone write moments" on public.moments
  for all using (true) with check (true);

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('photos', 'photos', true),
  ('moment-images', 'moment-images', true),
  ('article-covers', 'article-covers', true)
on conflict (id) do nothing;

create policy "public read memory room files"
on storage.objects for select
using (bucket_id in ('avatars', 'photos', 'moment-images', 'article-covers'));

create policy "anyone upload memory room files"
on storage.objects for insert
with check (
  bucket_id in ('avatars', 'photos', 'moment-images', 'article-covers')
);

create policy "anyone update memory room files"
on storage.objects for update
using (
  bucket_id in ('avatars', 'photos', 'moment-images', 'article-covers')
);

create policy "anyone delete memory room files"
on storage.objects for delete
using (
  bucket_id in ('avatars', 'photos', 'moment-images', 'article-covers')
);

insert into public.users (id, role, display_name)
values ('00000000-0000-0000-0000-000000000001', 'owner', 'tteok')
on conflict (id) do nothing;

grant select, insert, update, delete on public.users, public.posts, public.photos, public.comments, public.music, public.social_links, public.moments to anon, authenticated;
