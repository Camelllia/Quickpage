-- 퀵페이지: Supabase 테이블 설정 (신규 프로젝트용 전체 스키마)
-- Supabase 대시보드 → SQL Editor → New query → 아래 전체 붙여넣기 → Run
--
-- ※ 이미 pages 테이블이 있는 기존 DB는 아래 파일만 실행하세요:
--    supabase/migrations/20250608_add_folders_and_page_meta.sql

-- 1) 폴더 테이블
create table if not exists public.folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists folders_user_id_idx on public.folders(user_id);

-- 2) 페이지 테이블 (ID 기반 URL)
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text,
  folder_id uuid references public.folders(id) on delete set null,
  starred boolean default false,
  data jsonb not null,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists pages_user_id_idx on public.pages(user_id);
create index if not exists pages_folder_id_idx on public.pages(folder_id);

-- 3) RLS 활성화
alter table public.folders enable row level security;
alter table public.pages enable row level security;

-- 4) 기존 정책 제거
drop policy if exists "Public read published pages" on public.pages;
drop policy if exists "Users manage own pages" on public.pages;
drop policy if exists "Authenticated users manage own pages" on public.pages;
drop policy if exists "Anonymous manage demo pages" on public.pages;
drop policy if exists "Authenticated users manage own folders" on public.folders;
drop policy if exists "Anonymous manage demo folders" on public.folders;

-- 5) pages 정책
create policy "Public read published pages"
  on public.pages for select
  using (published = true);

create policy "Authenticated users manage own pages"
  on public.pages for all
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

create policy "Anonymous manage demo pages"
  on public.pages for all
  using (user_id is null and auth.uid() is null)
  with check (user_id is null and auth.uid() is null);

-- 6) folders 정책
create policy "Authenticated users manage own folders"
  on public.folders for all
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

create policy "Anonymous manage demo folders"
  on public.folders for all
  using (user_id is null and auth.uid() is null)
  with check (user_id is null and auth.uid() is null);

-- 4) 트래킹 이벤트 (utm_* 수집)
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
