-- Allow creators to view purchases of their own designs
create policy "Creators can view sales of own designs"
  on public.purchases for select
  using (
    exists (
      select 1 from public.designs
      where designs.id = purchases.design_id
        and designs.creator_id = auth.uid()
    )
  );

-- Add 'gig' to jobs job_type check constraint
alter table public.jobs drop constraint if exists jobs_job_type_check;
alter table public.jobs add constraint jobs_job_type_check
  check (job_type in ('full-time', 'part-time', 'contract', 'freelance', 'gig'));
