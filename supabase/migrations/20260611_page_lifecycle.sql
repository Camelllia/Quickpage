-- 페이지 생명주기: 종료일 + 공개 정책 갱신

alter table public.pages
  add column if not exists expires_at timestamptz;

create index if not exists pages_expires_at_idx on public.pages(expires_at);

drop policy if exists "Public read published pages" on public.pages;
create policy "Public read published pages"
  on public.pages for select
  using (
    published = true
    and (expires_at is null or expires_at > now())
  );

-- 공개 URL 상태 조회 (비공개·종료 안내용, 데이터 노출 없음)
create or replace function public.get_page_public_status(page_id uuid)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select case
    when not exists (select 1 from public.pages p where p.id = page_id) then 'not_found'
    when not (select p.published from public.pages p where p.id = page_id) then 'unpublished'
    when (select p.expires_at from public.pages p where p.id = page_id) is not null
      and (select p.expires_at from public.pages p where p.id = page_id) <= now() then 'expired'
    else 'available'
  end;
$$;

revoke all on function public.get_page_public_status(uuid) from public;
grant execute on function public.get_page_public_status(uuid) to anon, authenticated;
