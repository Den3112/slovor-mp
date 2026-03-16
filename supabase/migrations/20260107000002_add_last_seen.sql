alter table if exists public.profiles
add column if not exists last_seen timestamp with time zone default now();
