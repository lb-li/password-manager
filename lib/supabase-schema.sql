-- 创建密码表
create table public.passwords (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  platform text not null,
  username text not null,
  password text not null,
  url text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- 设置行级安全策略
alter table public.passwords enable row level security;

-- 创建策略，只允许用户访问自己的密码
create policy "用户只能访问自己的密码" on public.passwords
  for all
  using (auth.uid() = user_id);

-- 创建索引
create index passwords_user_id_idx on public.passwords (user_id);
create index passwords_platform_idx on public.passwords (platform);

-- 创建更新触发器
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger passwords_updated_at
  before update on public.passwords
  for each row
  execute procedure public.handle_updated_at();
