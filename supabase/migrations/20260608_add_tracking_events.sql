-- 트래킹 이벤트 (utm_* 수집)
-- 기존 pages/folders 마이그레이션이 이미 적용된 DB에만 실행하세요.

create table if not exists public.tracking_events (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  created_at timestamptz default now()
);

create index if not exists tracking_events_page_id_created_at_idx
  on public.tracking_events(page_id, created_at desc);

alter table public.tracking_events enable row level security;

-- 공개 방문자는 published=true 페이지에 대해서만 insert 허용
drop policy if exists "Public insert tracking events" on public.tracking_events;
create policy "Public insert tracking events"
  on public.tracking_events for insert
  with check (
    exists (
      select 1 from public.pages p
      where p.id = tracking_events.page_id
        and p.published = true
    )
  );

-- 운영자(페이지 소유자)만 select 허용
drop policy if exists "Owner select tracking events" on public.tracking_events;
create policy "Owner select tracking events"
  on public.tracking_events for select
  using (
    exists (
      select 1 from public.pages p
      where p.id = tracking_events.page_id
        and p.user_id = auth.uid()
    )
  );

