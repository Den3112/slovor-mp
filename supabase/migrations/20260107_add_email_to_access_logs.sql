alter table public.access_logs
add column if not exists email text;
