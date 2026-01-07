create table if not exists public.access_logs (
    id uuid not null default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    ip_address text,
    country text,
    city text,
    created_at timestamp with time zone default now(),
    constraint access_logs_pkey primary key (id)
);

alter table public.access_logs enable row level security;

create policy "Users can view their own access logs"
    on public.access_logs for select
    using (auth.uid() = user_id);

create policy "Authenticated users and service roles can insert access logs"
    on public.access_logs for insert
    with check (true);
