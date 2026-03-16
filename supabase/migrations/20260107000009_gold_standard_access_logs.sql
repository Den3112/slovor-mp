-- Drop existing table
drop table if exists public.access_logs;

-- Recreate with Gold Standard structure and order
create table public.access_logs (
    id uuid not null default gen_random_uuid(),
    created_at timestamp with time zone default now(),

    -- Event Info
    event_type text not null default 'login', -- login, register, password_change
    status text not null default 'success',   -- success, failure

    -- User Info
    email text,
    user_id uuid references auth.users(id) on delete set null,

    -- Risk & Session
    risk_score integer default 0,
    session_id text,

    -- Network Info
    ip_address text,
    country text,
    city text,

    -- Device Info
    user_agent text,

    -- Details
    login_method text, -- google, email
    failure_reason text,

    constraint access_logs_pkey primary key (id)
);

-- Re-enable RLS
alter table public.access_logs enable row level security;

-- Policies (User can see their own logs)
create policy "Users can view their own access logs"
on public.access_logs for select
using (auth.uid() = user_id);

-- Policy for Service Role to insert logs (needed for unrestricted logging)
create policy "Service role can insert access logs"
on public.access_logs for insert
with check (true);
