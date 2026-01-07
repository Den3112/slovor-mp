alter table public.access_logs
add column if not exists user_agent text,
add column if not exists login_method text;
