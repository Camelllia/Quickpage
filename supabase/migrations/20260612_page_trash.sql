-- 휴지통: 소프트 삭제 (7일 보관)

alter table public.pages
  add column if not exists deleted_at timestamptz;

create index if not exists pages_deleted_at_idx on public.pages(deleted_at);

drop policy if exists "Public read published pages" on public.pages;
create policy "Public read published pages"
  on public.pages for select
  using (
    deleted_at is null
    and published = true
    and (expires_at is null or expires_at > now())
  );

create or replace function public.get_page_public_status(page_id uuid)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select case
    when not exists (select 1 from public.pages p where p.id = page_id) then 'not_found'
    when (select p.deleted_at from public.pages p where p.id = page_id) is not null then 'not_found'
    when not (select p.published from public.pages p where p.id = page_id) then 'unpublished'
    when (select p.expires_at from public.pages p where p.id = page_id) is not null
      and (select p.expires_at from public.pages p where p.id = page_id) <= now() then 'expired'
    else 'available'
  end;
$$;
