-- 퀵페이지: Supabase 테이블 설정 (신규 프로젝트용 전체 스키마)
-- Supabase 대시보드 → SQL Editor → New query → 아래 전체 붙여넣기 → Run
--
-- ※ 이미 pages 테이블이 있는 기존 DB는 아래 파일만 실행하세요:
--    supabase/migrations/20250608_add_folders_and_page_meta.sql

-- 1) 워크스페이스
create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists workspaces_owner_id_idx on public.workspaces(owner_id);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz default now(),
  unique (workspace_id, user_id)
);

create index if not exists workspace_members_user_id_idx on public.workspace_members(user_id);

-- 2) 폴더 테이블
create table if not exists public.folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists folders_user_id_idx on public.folders(user_id);
create index if not exists folders_workspace_id_idx on public.folders(workspace_id);

-- 3) 페이지 테이블 (ID 기반 URL)
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  name text,
  folder_id uuid references public.folders(id) on delete set null,
  starred boolean default false,
  data jsonb not null,
  published boolean default true,
  expires_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists pages_user_id_idx on public.pages(user_id);
create index if not exists pages_expires_at_idx on public.pages(expires_at);
create index if not exists pages_deleted_at_idx on public.pages(deleted_at);
create index if not exists pages_workspace_id_idx on public.pages(workspace_id);
create index if not exists pages_folder_id_idx on public.pages(folder_id);

-- 4) RLS 헬퍼 (workspaces ↔ workspace_members 순환 참조 방지)
create or replace function public.is_workspace_member(ws_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = ws_id
      and user_id = auth.uid()
  );
$$;

create or replace function public.is_workspace_owner(ws_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.workspaces
    where id = ws_id
      and owner_id = auth.uid()
  );
$$;

revoke all on function public.is_workspace_member(uuid) from public;
revoke all on function public.is_workspace_owner(uuid) from public;
grant execute on function public.is_workspace_member(uuid) to authenticated;
grant execute on function public.is_workspace_owner(uuid) to authenticated;

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

revoke all on function public.get_page_public_status(uuid) from public;
grant execute on function public.get_page_public_status(uuid) to anon, authenticated;

-- 5) RLS 활성화
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.folders enable row level security;
alter table public.pages enable row level security;

-- 기존 정책 제거
drop policy if exists "Public read published pages" on public.pages;
drop policy if exists "Users manage own pages" on public.pages;
drop policy if exists "Authenticated users manage own pages" on public.pages;
drop policy if exists "Anonymous manage demo pages" on public.pages;
drop policy if exists "Authenticated users manage own folders" on public.folders;
drop policy if exists "Anonymous manage demo folders" on public.folders;

-- workspaces 정책
drop policy if exists "Members read workspaces" on public.workspaces;
create policy "Members read workspaces"
  on public.workspaces for select
  using (
    owner_id = auth.uid()
    or public.is_workspace_member(id)
  );

drop policy if exists "Users create own workspaces" on public.workspaces;
create policy "Users create own workspaces"
  on public.workspaces for insert
  with check (auth.uid() is not null and owner_id = auth.uid());

drop policy if exists "Owners update workspaces" on public.workspaces;
create policy "Owners update workspaces"
  on public.workspaces for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "Owners delete workspaces" on public.workspaces;
create policy "Owners delete workspaces"
  on public.workspaces for delete
  using (owner_id = auth.uid());

drop policy if exists "Users read own memberships" on public.workspace_members;
create policy "Users read own memberships"
  on public.workspace_members for select
  using (user_id = auth.uid());

drop policy if exists "Users insert self as member on create" on public.workspace_members;
create policy "Users insert self as member on create"
  on public.workspace_members for insert
  with check (user_id = auth.uid());

drop policy if exists "Owners delete memberships" on public.workspace_members;
create policy "Owners delete memberships"
  on public.workspace_members for delete
  using (
    user_id = auth.uid()
    or public.is_workspace_owner(workspace_id)
  );

-- pages 정책
create policy "Public read published pages"
  on public.pages for select
  using (
    deleted_at is null
    and published = true
    and (expires_at is null or expires_at > now())
  );

create policy "Authenticated users manage own pages"
  on public.pages for all
  using (
    auth.uid() is not null
    and auth.uid() = user_id
    and (
      workspace_id is null
      or public.is_workspace_member(workspace_id)
    )
  )
  with check (
    auth.uid() is not null
    and auth.uid() = user_id
    and (
      workspace_id is null
      or public.is_workspace_member(workspace_id)
    )
  );

create policy "Anonymous manage demo pages"
  on public.pages for all
  using (user_id is null and auth.uid() is null)
  with check (user_id is null and auth.uid() is null);

-- 6) folders 정책
create policy "Authenticated users manage own folders"
  on public.folders for all
  using (
    auth.uid() is not null
    and auth.uid() = user_id
    and (
      workspace_id is null
      or public.is_workspace_member(workspace_id)
    )
  )
  with check (
    auth.uid() is not null
    and auth.uid() = user_id
    and (
      workspace_id is null
      or public.is_workspace_member(workspace_id)
    )
  );

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
