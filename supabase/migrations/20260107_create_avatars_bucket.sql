-- Create the 'avatars' bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Policy: Allow public read access to avatars
create policy "Avatar images are publicly accessible"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- Policy: Allow authenticated users to upload their own avatar
-- We assume the file path convention is: user_id/filename
create policy "Users can upload their own avatar"
on storage.objects for insert
with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow users to update their own avatar
create policy "Users can update their own avatar"
on storage.objects for update
using (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow users to delete their own avatar
create policy "Users can delete their own avatar"
on storage.objects for delete
using (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
);
