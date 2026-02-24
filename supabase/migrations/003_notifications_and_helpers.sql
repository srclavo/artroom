-- ============================================
-- Migration 003: Notifications + helper functions
-- ============================================

-- Notifications table
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text check (type in ('sale', 'purchase', 'follow', 'like', 'system')) not null,
  title text not null,
  message text,
  data jsonb default '{}',
  is_read boolean default false,
  created_at timestamptz default now()
);

create index idx_notifications_user on public.notifications(user_id);
create index idx_notifications_unread on public.notifications(user_id) where not is_read;

alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Service role can insert notifications"
  on public.notifications for insert
  with check (true);

-- Helper: increment download count
create or replace function increment_download_count(design_id_param uuid)
returns void as $$
begin
  update public.designs
  set download_count = download_count + 1
  where id = design_id_param;
end;
$$ language plpgsql security definer;
