-- 如果已经执行过旧版 001_init.sql，再执行本文件。
-- 去掉登录，改成谁都能读写。

alter table public.users drop constraint if exists users_id_fkey;

insert into public.users (id, role, display_name)
values ('00000000-0000-0000-0000-000000000001', 'owner', 'tteok')
on conflict (id) do nothing;

drop policy if exists "staff update users" on public.users;
drop policy if exists "anyone write users" on public.users;
create policy "anyone write users" on public.users
  for all using (true) with check (true);

drop policy if exists "posts public" on public.posts;
drop policy if exists "staff write posts" on public.posts;
drop policy if exists "anyone write posts" on public.posts;
create policy "posts public" on public.posts for select using (true);
create policy "anyone write posts" on public.posts for all using (true) with check (true);

drop policy if exists "photos public" on public.photos;
drop policy if exists "staff insert photos" on public.photos;
drop policy if exists "staff update photos" on public.photos;
drop policy if exists "staff delete photos" on public.photos;
drop policy if exists "anyone write photos" on public.photos;
create policy "photos public" on public.photos for select using (true);
create policy "anyone write photos" on public.photos for all using (true) with check (true);

drop policy if exists "comments public" on public.comments;
drop policy if exists "anyone can leave comments" on public.comments;
drop policy if exists "staff can reply comments" on public.comments;
drop policy if exists "staff update comments" on public.comments;
drop policy if exists "staff delete comments" on public.comments;
drop policy if exists "anyone insert comments" on public.comments;
drop policy if exists "anyone update comments" on public.comments;
drop policy if exists "anyone delete comments" on public.comments;
create policy "comments public" on public.comments for select using (true);
create policy "anyone insert comments" on public.comments
  for insert with check (
    char_length(trim(nickname)) between 1 and 24
    and char_length(trim(body)) between 1 and 500
  );
create policy "anyone update comments" on public.comments for update using (true) with check (true);
create policy "anyone delete comments" on public.comments for delete using (true);

drop policy if exists "music public" on public.music;
drop policy if exists "staff write music" on public.music;
drop policy if exists "anyone write music" on public.music;
create policy "music public" on public.music for select using (true);
create policy "anyone write music" on public.music for all using (true) with check (true);

drop policy if exists "staff write social links" on public.social_links;
drop policy if exists "anyone write social links" on public.social_links;
create policy "anyone write social links" on public.social_links
  for all using (true) with check (true);

drop policy if exists "moments public" on public.moments;
drop policy if exists "staff insert moments" on public.moments;
drop policy if exists "staff update moments" on public.moments;
drop policy if exists "staff delete moments" on public.moments;
drop policy if exists "anyone write moments" on public.moments;
create policy "moments public" on public.moments for select using (true);
create policy "anyone write moments" on public.moments for all using (true) with check (true);

drop policy if exists "staff upload memory room files" on storage.objects;
drop policy if exists "staff update memory room files" on storage.objects;
drop policy if exists "staff delete memory room files" on storage.objects;
drop policy if exists "anyone upload memory room files" on storage.objects;
drop policy if exists "anyone update memory room files" on storage.objects;
drop policy if exists "anyone delete memory room files" on storage.objects;

create policy "anyone upload memory room files"
on storage.objects for insert
with check (bucket_id in ('avatars', 'photos', 'moment-images', 'article-covers'));

create policy "anyone update memory room files"
on storage.objects for update
using (bucket_id in ('avatars', 'photos', 'moment-images', 'article-covers'));

create policy "anyone delete memory room files"
on storage.objects for delete
using (bucket_id in ('avatars', 'photos', 'moment-images', 'article-covers'));

grant select, insert, update, delete on public.users, public.posts, public.photos, public.comments, public.music, public.social_links, public.moments to anon, authenticated;
