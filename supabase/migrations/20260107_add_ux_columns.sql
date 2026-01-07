-- Add last_seen to profiles
alter table if exists public.profiles
add column if not exists last_seen timestamp with time zone default now();

-- Add formatted readable date to access_logs
-- Note: 'generated always as' is available in Postgres 12+.
-- Using to_char to format "DD.MM.YYYY HH24:MI:SS"
-- Since created_at is timestamp with time zone, we might want to cast to local time if we knew it,
-- but server time is UTC. We will format as UTC string + " UTC" for clarity.
alter table public.access_logs
add column if not exists formatted_date text generated always as (to_char(created_at, 'DD.MM.YYYY HH24:MI:SS "UTC"')) stored;
