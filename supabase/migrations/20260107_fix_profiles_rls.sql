-- Allow users to insert their own profile row
-- (Needed for upsert to work if row is missing, and general robustness)
create policy "Users can insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);
