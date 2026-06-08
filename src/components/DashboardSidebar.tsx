"use client";

import { useState, type ReactNode } from "react";
import { PERSONAL_SCOPE_ID, TRASH_SCOPE_ID, isPersonalScope, isTrashScope } from "@/lib/active-workspace";
import type { Workspace } from "@/lib/types";

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M10 9.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4.5 16.5v-.75A4.25 4.25 0 0 1 8.75 11.5h2.5a4.25 4.25 0 0 1 4.25 4.25v.75" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M6.5 7.5v6.25A1.25 1.25 0 0 0 7.75 15h4.5a1.25 1.25 0 0 0 1.25-1.25V7.5m-8.5 0h10M8.25 7.5V5.75A.75.75 0 0 1 9 5h2a.75.75 0 0 1 .75.75V7.5M8 9.25v4.5M10 9.25v4.5M12 9.25v4.5" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M7 9.25a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5ZM13.25 8.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM3.5 15.75v-.5A3.25 3.25 0 0 1 6.75 12h.5A3.25 3.25 0 0 1 10.5 15.25v.5M11.75 12h.5a3.25 3.25 0 0 1 3.25 3.25v.5" />
    </svg>
  );
}

function ScopeItem({
  active,
  icon,
  label,
  onClick,
  trailing,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
  trailing?: ReactNode;
}) {
  return (
    <div className="group relative flex items-center">
      <button
        type="button"
        onClick={onClick}
        className={`flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
          active
            ? "bg-[#ff4d6d]/10 text-[#ff4d6d]"
            : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        <span className={`shrink-0 ${active ? "text-[#ff4d6d]" : "text-gray-400"}`}>{icon}</span>
        <span className="truncate">{label}</span>
      </button>
      {trailing}
    </div>
  );
}

interface DashboardSidebarProps {
  workspaces: Workspace[];
  activeId: string;
  onChange: (id: string) => void;
  onCreateWorkspace: () => void;
  onRenameWorkspace: (workspace: Workspace) => void;
  onDeleteWorkspace: (workspace: Workspace) => void;
}

export default function DashboardSidebar({
  workspaces,
  activeId,
  onChange,
  onCreateWorkspace,
  onRenameWorkspace,
  onDeleteWorkspace,
}: DashboardSidebarProps) {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const scopeItems = [
    { id: PERSONAL_SCOPE_ID, label: "내 페이지", icon: <UserIcon className="h-4 w-4" /> },
    ...workspaces.map((ws) => ({
      id: ws.id,
      label: ws.name,
      icon: <UsersIcon className="h-4 w-4" />,
      workspace: ws,
    })),
  ];

  const mobileNav = (
    <div className="flex gap-2 overflow-x-auto border-b border-gray-200 bg-white px-4 py-3 md:hidden">
      {scopeItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            activeId === item.id
              ? "bg-[#ff4d6d] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {item.label}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(TRASH_SCOPE_ID)}
        className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium ${
          isTrashScope(activeId)
            ? "bg-gray-800 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        휴지통
      </button>
      <button
        type="button"
        onClick={onCreateWorkspace}
        className="shrink-0 rounded-full border border-dashed border-gray-300 px-3 py-1.5 text-sm text-gray-500"
      >
        + 워크스페이스
      </button>
    </div>
  );

  const desktopSidebar = (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-gray-200 bg-white md:flex">
      <nav className="flex flex-1 flex-col overflow-y-auto p-3">
        <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          개인
        </p>
        <ScopeItem
          active={isPersonalScope(activeId)}
          icon={<UserIcon className="h-4 w-4" />}
          label="내 페이지"
          onClick={() => onChange(PERSONAL_SCOPE_ID)}
        />

        <p className="mb-1 mt-5 px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          워크스페이스
        </p>
        <div className="space-y-0.5">
          {workspaces.length === 0 ? (
            <p className="px-3 py-2 text-xs text-gray-400">아직 워크스페이스가 없습니다</p>
          ) : (
            workspaces.map((ws) => (
              <ScopeItem
                key={ws.id}
                active={activeId === ws.id}
                icon={<UsersIcon className="h-4 w-4" />}
                label={ws.name}
                onClick={() => onChange(ws.id)}
                trailing={
                  <div className="relative ml-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === ws.id ? null : ws.id);
                      }}
                      className="rounded-md p-1 text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100 data-[open=true]:opacity-100"
                      data-open={menuOpenId === ws.id}
                      aria-label={`${ws.name} 메뉴`}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm3.5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm3.5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                      </svg>
                    </button>
                    {menuOpenId === ws.id && (
                      <>
                        <button
                          type="button"
                          className="fixed inset-0 z-10 cursor-default"
                          aria-label="메뉴 닫기"
                          onClick={() => setMenuOpenId(null)}
                        />
                        <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                          <button
                            type="button"
                            className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => {
                              setMenuOpenId(null);
                              onRenameWorkspace(ws);
                            }}
                          >
                            이름 변경
                          </button>
                          <button
                            type="button"
                            className="block w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                            onClick={() => {
                              setMenuOpenId(null);
                              onDeleteWorkspace(ws);
                            }}
                          >
                            삭제
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                }
              />
            ))
          )}
        </div>

        <p className="mb-1 mt-5 px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          기타
        </p>
        <ScopeItem
          active={isTrashScope(activeId)}
          icon={<TrashIcon className="h-4 w-4" />}
          label="휴지통"
          onClick={() => onChange(TRASH_SCOPE_ID)}
        />
      </nav>

      <div className="border-t border-gray-100 p-3">
        <button
          type="button"
          onClick={onCreateWorkspace}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#ff4d6d]"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-md border border-dashed border-gray-300 text-xs">
            +
          </span>
          워크스페이스 만들기
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {mobileNav}
      {desktopSidebar}
    </>
  );
}
