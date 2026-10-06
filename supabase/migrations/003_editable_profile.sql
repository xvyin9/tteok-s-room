alter table public.users
  add column if not exists listening text not null default 'BGM',
  add column if not exists eating text not null default '年糕',
  add column if not exists weather text not null default '晴 ★',
  add column if not exists location text not null default 'memory room',
  add column if not exists doing text not null default '慢慢翻旧照片',
  add column if not exists sticker text not null default '喜欢这里 (positive)',
  add column if not exists useless_note text not null default 'guestbook is open';
