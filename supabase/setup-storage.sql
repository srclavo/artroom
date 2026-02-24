-- ArtRoom Marketplace - Storage Bucket Setup
-- Run this in your Supabase SQL Editor after the initial migration

-- 1. Create storage buckets
insert into storage.buckets (id, name, public) values ('thumbnails', 'thumbnails', true);
insert into storage.buckets (id, name, public) values ('design-files', 'design-files', false);
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
insert into storage.buckets (id, name, public) values ('covers', 'covers', true);

-- 2. Thumbnails — public read, auth users manage own files
create policy "Public thumbnail read"
  on storage.objects for select
  using (bucket_id = 'thumbnails');

create policy "Auth users upload thumbnails"
  on storage.objects for insert
  with check (bucket_id = 'thumbnails' and auth.role() = 'authenticated');

create policy "Users update own thumbnails"
  on storage.objects for update
  using (bucket_id = 'thumbnails' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users delete own thumbnails"
  on storage.objects for delete
  using (bucket_id = 'thumbnails' and (storage.foldername(name))[1] = auth.uid()::text);

-- 3. Design files — private, owner or purchaser can download
create policy "Owner can read own design files"
  on storage.objects for select
  using (
    bucket_id = 'design-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Auth users upload design files"
  on storage.objects for insert
  with check (bucket_id = 'design-files' and auth.role() = 'authenticated');

create policy "Users update own design files"
  on storage.objects for update
  using (bucket_id = 'design-files' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users delete own design files"
  on storage.objects for delete
  using (bucket_id = 'design-files' and (storage.foldername(name))[1] = auth.uid()::text);

-- 4. Avatars — public read, auth users manage own
create policy "Public avatar read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Auth users upload avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Users update own avatars"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users delete own avatars"
  on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- 5. Covers — public read, auth users manage own
create policy "Public cover read"
  on storage.objects for select
  using (bucket_id = 'covers');

create policy "Auth users upload covers"
  on storage.objects for insert
  with check (bucket_id = 'covers' and auth.role() = 'authenticated');

create policy "Users update own covers"
  on storage.objects for update
  using (bucket_id = 'covers' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users delete own covers"
  on storage.objects for delete
  using (bucket_id = 'covers' and (storage.foldername(name))[1] = auth.uid()::text);
