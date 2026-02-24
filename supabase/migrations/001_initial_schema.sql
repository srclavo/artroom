-- ArtRoom Marketplace - Initial Database Schema
-- Extensiones
create extension if not exists "uuid-ossp";

-- USERS (extiende auth.users de Supabase)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  cover_image_url text,
  role text check (role in ('creator', 'buyer', 'company')) default 'buyer',
  wallet_address text,
  stripe_account_id text,
  website_url text,
  social_links jsonb default '{}',
  skills text[] default '{}',
  is_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- DESIGNS (productos del marketplace)
create table public.designs (
  id uuid default uuid_generate_v4() primary key,
  creator_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  price decimal(10,2) not null default 0,
  currency text default 'USD',
  category text not null,
  subcategory text,
  tags text[] default '{}',
  thumbnail_url text not null,
  preview_urls text[] default '{}',
  file_url text,
  file_size bigint,
  file_format text,
  license_type text check (license_type in ('personal', 'commercial', 'extended')) default 'personal',
  view_count integer default 0,
  download_count integer default 0,
  like_count integer default 0,
  is_featured boolean default false,
  status text check (status in ('draft', 'published', 'archived')) default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- PORTFOLIOS (proyectos/templates de portafolio)
create table public.portfolios (
  id uuid default uuid_generate_v4() primary key,
  creator_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  price decimal(10,2) default 0,
  thumbnail_url text not null,
  preview_urls text[] default '{}',
  category text,
  tags text[] default '{}',
  view_count integer default 0,
  status text check (status in ('draft', 'published', 'archived')) default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- PURCHASES (transacciones)
create table public.purchases (
  id uuid default uuid_generate_v4() primary key,
  buyer_id uuid references public.profiles(id) not null,
  design_id uuid references public.designs(id),
  portfolio_id uuid references public.portfolios(id),
  amount decimal(10,2) not null,
  platform_fee decimal(10,2) not null,
  creator_payout decimal(10,2) not null,
  payment_method text check (payment_method in ('card', 'apple_pay', 'usdc')) not null,
  payment_network text,
  transaction_hash text,
  stripe_payment_id text,
  status text check (status in ('pending', 'completed', 'failed', 'refunded')) default 'pending',
  created_at timestamptz default now()
);

-- JOBS (ofertas de trabajo)
create table public.jobs (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  company_name text not null,
  company_logo_url text,
  location text,
  job_type text check (job_type in ('full-time', 'part-time', 'contract', 'freelance')) not null,
  experience_level text check (experience_level in ('junior', 'mid', 'senior', 'lead')),
  salary_min decimal(10,2),
  salary_max decimal(10,2),
  salary_currency text default 'USD',
  skills_required text[] default '{}',
  application_url text,
  is_remote boolean default false,
  is_featured boolean default false,
  status text check (status in ('active', 'closed', 'draft')) default 'draft',
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- LIKES
create table public.likes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  design_id uuid references public.designs(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, design_id)
);

-- FOLLOWS
create table public.follows (
  id uuid default uuid_generate_v4() primary key,
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(follower_id, following_id)
);

-- INDEXES
create index idx_designs_creator on public.designs(creator_id);
create index idx_designs_category on public.designs(category);
create index idx_designs_status on public.designs(status);
create index idx_purchases_buyer on public.purchases(buyer_id);
create index idx_purchases_design on public.purchases(design_id);
create index idx_jobs_status on public.jobs(status);
create index idx_jobs_type on public.jobs(job_type);

-- ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.designs enable row level security;
alter table public.portfolios enable row level security;
alter table public.purchases enable row level security;
alter table public.jobs enable row level security;
alter table public.likes enable row level security;
alter table public.follows enable row level security;

-- Policies: profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Policies: designs
create policy "Published designs are viewable by everyone"
  on public.designs for select using (status = 'published' or creator_id = auth.uid());
create policy "Creators can insert own designs"
  on public.designs for insert with check (creator_id = auth.uid());
create policy "Creators can update own designs"
  on public.designs for update using (creator_id = auth.uid());

-- Policies: portfolios
create policy "Published portfolios are viewable by everyone"
  on public.portfolios for select using (status = 'published' or creator_id = auth.uid());
create policy "Creators can insert own portfolios"
  on public.portfolios for insert with check (creator_id = auth.uid());
create policy "Creators can update own portfolios"
  on public.portfolios for update using (creator_id = auth.uid());

-- Policies: purchases
create policy "Users can view own purchases"
  on public.purchases for select using (buyer_id = auth.uid());
create policy "Authenticated users can make purchases"
  on public.purchases for insert with check (auth.uid() = buyer_id);

-- Policies: jobs
create policy "Active jobs are viewable by everyone"
  on public.jobs for select using (status = 'active' or company_id = auth.uid());
create policy "Companies can manage own jobs"
  on public.jobs for insert with check (company_id = auth.uid());
create policy "Companies can update own jobs"
  on public.jobs for update using (company_id = auth.uid());

-- Policies: likes
create policy "Users can view all likes"
  on public.likes for select using (true);
create policy "Users can manage own likes"
  on public.likes for insert with check (auth.uid() = user_id);
create policy "Users can delete own likes"
  on public.likes for delete using (auth.uid() = user_id);

-- Policies: follows
create policy "Users can view all follows"
  on public.follows for select using (true);
create policy "Users can manage own follows"
  on public.follows for insert with check (auth.uid() = follower_id);
create policy "Users can delete own follows"
  on public.follows for delete using (auth.uid() = follower_id);

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger on_profile_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger on_design_updated
  before update on public.designs
  for each row execute function public.handle_updated_at();

create trigger on_portfolio_updated
  before update on public.portfolios
  for each row execute function public.handle_updated_at();

create trigger on_job_updated
  before update on public.jobs
  for each row execute function public.handle_updated_at();
