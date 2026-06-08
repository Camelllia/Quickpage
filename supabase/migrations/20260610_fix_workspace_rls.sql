-- workspaces ↔ workspace_members RLS 순환 참조 해소
-- (infinite recursion detected in policy for relation "workspaces")

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

-- workspaces
drop policy if exists "Members read workspaces" on public.workspaces;
create policy "Members read workspaces"
  on public.workspaces for select
  using (
    owner_id = auth.uid()
    or public.is_workspace_member(id)
  );

-- workspace_members (순환 유발하던 "Owners manage memberships" 제거)
drop policy if exists "Owners manage memberships" on public.workspace_members;

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

-- pages / folders: 멤버십 검사도 헬퍼 함수로 통일
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
