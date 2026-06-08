-- 워크스페이스 (B안): workspaces + members, pages/folders에 workspace_id

-- 1) 워크스페이스
create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists workspaces_owner_id_idx on public.workspaces(owner_id);

-- 2) 멤버 (MVP: owner만 자동 추가, 팀 확장용)
create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz default now(),
  unique (workspace_id, user_id)
);

create index if not exists workspace_members_user_id_idx on public.workspace_members(user_id);
create index if not exists workspace_members_workspace_id_idx on public.workspace_members(workspace_id);

-- 3) pages / folders에 workspace_id
alter table public.pages add column if not exists workspace_id uuid references public.workspaces(id) on delete cascade;
alter table public.folders add column if not exists workspace_id uuid references public.workspaces(id) on delete cascade;

create index if not exists pages_workspace_id_idx on public.pages(workspace_id);
create index if not exists folders_workspace_id_idx on public.folders(workspace_id);

-- 4) RLS 헬퍼 (테이블 간 정책 순환 방지)
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

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

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

-- pages/folders: 워크스페이스 멤버만 해당 workspace 데이터 관리
drop policy if exists "Authenticated users manage own pages" on public.pages;
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

drop policy if exists "Authenticated users manage own folders" on public.folders;
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
