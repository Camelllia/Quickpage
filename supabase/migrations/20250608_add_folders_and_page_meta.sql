-- =============================================================================
-- 퀵페이지 마이그레이션: 폴더 + 페이지 메타 (name, folder_id, starred)
-- 대상: 이미 public.pages 테이블이 있는 기존 Supabase 프로젝트
--
-- 실행: Supabase 대시보드 → SQL Editor → New query → 붙여넣기 → Run
-- 안전하게 여러 번 실행 가능 (IF NOT EXISTS / DROP IF EXISTS 사용)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1) folders 테이블 (pages.folder_id FK보다 먼저 생성)
-- -----------------------------------------------------------------------------
create table if not exists public.folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists folders_user_id_idx on public.folders(user_id);

-- -----------------------------------------------------------------------------
-- 2) pages 테이블에 메타 컬럼 추가
-- -----------------------------------------------------------------------------
alter table public.pages add column if not exists name text;
alter table public.pages add column if not exists folder_id uuid;
alter table public.pages add column if not exists starred boolean default false;

-- folder_id FK (컬럼이 이미 있어도 constraint 없으면 추가)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'pages_folder_id_fkey'
      and conrelid = 'public.pages'::regclass
  ) then
    alter table public.pages
      add constraint pages_folder_id_fkey
      foreign key (folder_id) references public.folders(id) on delete set null;
  end if;
end $$;

create index if not exists pages_folder_id_idx on public.pages(folder_id);

-- 기존 행: name이 비어 있으면 data.title로 채움
update public.pages
set name = coalesce(nullif(trim(name), ''), data->>'title', '제목 없음')
where name is null or trim(name) = '';

-- starred NULL 방지
update public.pages set starred = false where starred is null;

-- -----------------------------------------------------------------------------
-- 3) (선택) 예전 slug 기반 스키마 정리 — slug 컬럼이 있을 때만 실행
-- -----------------------------------------------------------------------------
alter table public.pages drop constraint if exists pages_slug_key;
drop index if exists pages_slug_idx;
alter table public.pages drop column if exists slug;

-- -----------------------------------------------------------------------------
-- 4) RLS — folders
-- -----------------------------------------------------------------------------
alter table public.folders enable row level security;

drop policy if exists "Authenticated users manage own folders" on public.folders;
drop policy if exists "Anonymous manage demo folders" on public.folders;

create policy "Authenticated users manage own folders"
  on public.folders for all
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

create policy "Anonymous manage demo folders"
  on public.folders for all
  using (user_id is null and auth.uid() is null)
  with check (user_id is null and auth.uid() is null);

-- -----------------------------------------------------------------------------
-- 5) RLS — pages (기존 정책 유지·재생성, folders 추가로 pages 정책 변경 없음)
--    pages 정책이 아직 없는 경우에만 아래 블록이 필요합니다.
-- -----------------------------------------------------------------------------
alter table public.pages enable row level security;

drop policy if exists "Public read published pages" on public.pages;
drop policy if exists "Users manage own pages" on public.pages;
drop policy if exists "Authenticated users manage own pages" on public.pages;
drop policy if exists "Anonymous manage demo pages" on public.pages;

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
