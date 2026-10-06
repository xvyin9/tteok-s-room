-- tteok's Memory Room
-- 在 Supabase SQL Editor 执行本文件。
-- Authentication → 关闭公开注册
-- 创建两个 Auth 用户后，把 uuid 写入 public.users（见文件末尾）

create extension if not exists "pgcrypto";

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('owner', 'friend')),
  display_name text not null default 'tteok',
  bio text not null default '这里是 tteok 的记忆小窝。请随便坐。',
  mood text not null default '今天想吃年糕',
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

create policy "staff update users" on public.users
  for update using (public.is_staff());

create policy "posts public" on public.posts
  for select using (is_published = true or public.is_staff());

create policy "staff write posts" on public.posts
  for all using (public.is_staff()) with check (public.is_staff());

create policy "photos public" on public.photos
  for select using (is_hidden = false or public.is_staff());

create policy "staff insert photos" on public.photos
  for insert with check (public.is_staff());

create policy "staff update photos" on public.photos
  for update using (public.is_staff());

create policy "staff delete photos" on public.photos
  for delete using (public.is_staff());

create policy "comments public" on public.comments
  for select using (is_hidden = false or public.is_staff());

create policy "anyone can leave comments" on public.comments
  for insert with check (
    parent_id is null
    and created_by is null
    and char_length(trim(nickname)) between 1 and 24
    and char_length(trim(body)) between 1 and 500
  );

create policy "staff can reply comments" on public.comments
  for insert with check (
    public.is_staff()
    and parent_id is not null
  );

create policy "staff update comments" on public.comments
  for update using (public.is_staff());

create policy "staff delete comments" on public.comments
  for delete using (public.is_staff());

create policy "music public" on public.music
  for select using (is_active = true or public.is_staff());

create policy "staff write music" on public.music
  for all using (public.is_staff()) with check (public.is_staff());

create policy "social links public" on public.social_links
  for select using (true);

create policy "staff write social links" on public.social_links
  for all using (public.is_staff()) with check (public.is_staff());

create policy "moments public" on public.moments
  for select using (is_hidden = false or public.is_staff());

create policy "staff insert moments" on public.moments
  for insert with check (public.is_staff());

create policy "staff update moments" on public.moments
  for update using (public.is_staff());

create policy "staff delete moments" on public.moments
  for delete using (public.is_staff());

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

create policy "staff upload memory room files"
on storage.objects for insert
with check (
  bucket_id in ('avatars', 'photos', 'moment-images', 'article-covers')
  and public.is_staff()
);

create policy "staff update memory room files"
on storage.objects for update
using (
  bucket_id in ('avatars', 'photos', 'moment-images', 'article-covers')
  and public.is_staff()
);

create policy "staff delete memory room files"
on storage.objects for delete
using (
  bucket_id in ('avatars', 'photos', 'moment-images', 'article-covers')
  and public.is_staff()
);

-- 建好两个 Auth 用户后执行（替换 uuid）：
-- insert into public.users (id, role, display_name) values
--   ('OWNER_UUID', 'owner', '你'),
--   ('FRIEND_UUID', 'friend', 'tteok');
