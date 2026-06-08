"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageActionsMenu from "@/components/PageActionsMenu";
import FolderCreateModal from "@/components/FolderCreateModal";
import TrackingLogsModal from "@/components/TrackingLogsModal";
import WorkspaceCreateModal from "@/components/WorkspaceCreateModal";
import PageSettingsModal from "@/components/PageSettingsModal";
import TrashPageCard from "@/components/TrashPageCard";
import DashboardSidebar from "@/components/DashboardSidebar";
import StarIcon from "@/components/icons/StarIcon";
import { getPageBlockReason } from "@/lib/page-lifecycle";
import { TRASH_RETENTION_DAYS } from "@/lib/page-trash";
import {
  ACTIVE_WORKSPACE_KEY,
  PERSONAL_SCOPE_ID,
  TRASH_SCOPE_ID,
  getActiveScopeId,
  isPersonalScope,
  isTrashScope,
  setActiveWorkspaceId,
} from "@/lib/active-workspace";
import type { PageFolder, SavedPageRecord, Workspace } from "@/lib/types";

type FilterKey = "all" | "starred" | string;

function PageCard({
  page,
  folders,
  onDelete,
  onToggleStar,
  onRename,
  onMoveToFolder,
  onShowTrackingLogs,
  onDuplicate,
  onOpenSettings,
}: {
  page: SavedPageRecord;
  folders: PageFolder[];
  onDelete: (id: string) => void;
  onToggleStar: (id: string, starred: boolean) => void;
  onRename: (id: string, currentName: string) => void;
  onMoveToFolder: (id: string, folderId: string | null) => void;
  onShowTrackingLogs: (page: SavedPageRecord) => void;
  onDuplicate: (id: string) => void;
  onOpenSettings: (page: SavedPageRecord) => void;
}) {
  const blockReason = getPageBlockReason(page);
  const statusLabel =
    blockReason === "unpublished"
      ? "비공개"
      : blockReason === "expired"
        ? "종료됨"
        : page.expiresAt
          ? "종료 예정"
          : null;
  return (
    <div className="card-hover relative rounded-2xl border border-gray-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleStar(page.id, !page.starred);
        }}
        className={`absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110 ${
          page.starred ? "ring-2 ring-[#ff4d6d]/30" : "hover:ring-2 hover:ring-gray-200"
        }`}
        aria-label={page.starred ? "즐겨찾기 해제" : "즐겨찾기"}
      >
        <StarIcon filled={page.starred} size={16} />
      </button>
      <div
        className="absolute top-3 right-3 z-10"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <PageActionsMenu
          data={page.data}
          displayName={page.name}
          pageId={page.id}
          folders={folders}
          currentFolderId={page.folderId}
          onRename={() => onRename(page.id, page.name)}
          onMoveToFolder={(folderId) => onMoveToFolder(page.id, folderId)}
          onShowTrackingLogs={() => onShowTrackingLogs(page)}
          onDuplicate={() => onDuplicate(page.id)}
          onOpenSettings={() => onOpenSettings(page)}
          onDelete={() => onDelete(page.id)}
          variant="sheet"
        />
      </div>
      <Link
        href={`/create?edit=${page.id}`}
        className="group block cursor-pointer transition-colors hover:bg-gray-50/50"
      >
        <div
          className="h-32 overflow-hidden rounded-t-2xl bg-cover bg-center"
          style={{ backgroundImage: `url(${page.data.bannerUrl})` }}
        />
        <div className="p-4 pl-12">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-gray-900 group-hover:text-[#ff4d6d]">{page.name}</h3>
            {statusLabel && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  blockReason
                    ? "bg-gray-100 text-gray-500"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {statusLabel}
              </span>
            )}
          </div>
          {page.name !== page.data.title && (
            <p className="mt-0.5 text-xs text-gray-400">페이지 제목: {page.data.title}</p>
          )}
          <p className="mt-1 line-clamp-1 text-sm text-gray-500">{page.data.subtitle}</p>
          <p className="mt-3 text-xs text-gray-400">
            /p/{page.id.slice(0, 8)}… · {new Date(page.updatedAt).toLocaleDateString("ko-KR")} 수정
          </p>
        </div>
      </Link>
    </div>
  );
}

export default function DashboardContent() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceIdState] = useState<string>(PERSONAL_SCOPE_ID);
  const [pages, setPages] = useState<SavedPageRecord[]>([]);
  const [folders, setFolders] = useState<PageFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);
  const [trackingLogsPage, setTrackingLogsPage] = useState<SavedPageRecord | null>(null);
  const [settingsPage, setSettingsPage] = useState<SavedPageRecord | null>(null);

  const fetchWorkspaces = useCallback(async () => {
    const res = await fetch("/api/workspaces");
    const json = await res.json();
    const list = (json.workspaces ?? []) as Workspace[];
    setWorkspaces(list);

    const saved =
      (typeof window !== "undefined" ? localStorage.getItem(ACTIVE_WORKSPACE_KEY) : null) ??
      PERSONAL_SCOPE_ID;
    const initial =
      saved === TRASH_SCOPE_ID
        ? TRASH_SCOPE_ID
        : isPersonalScope(saved) || list.some((w) => w.id === saved)
          ? saved
          : PERSONAL_SCOPE_ID;
    setActiveWorkspaceIdState(initial);
    setActiveWorkspaceId(initial);
    return initial;
  }, []);

  const fetchAll = useCallback(
    async (workspaceId?: string | null) => {
      const wsId = workspaceId ?? activeWorkspaceId ?? PERSONAL_SCOPE_ID;

      setLoading(true);
      try {
        if (isTrashScope(wsId)) {
          const pagesRes = await fetch("/api/pages?trash=true");
          const pagesJson = await pagesRes.json();
          setPages(pagesJson.pages ?? []);
          setFolders([]);
          return;
        }
        const [pagesRes, foldersRes] = await Promise.all([
          fetch(`/api/pages?workspaceId=${encodeURIComponent(wsId)}`),
          fetch(`/api/folders?workspaceId=${encodeURIComponent(wsId)}`),
        ]);
        const pagesJson = await pagesRes.json();
        const foldersJson = await foldersRes.json();
        setPages(pagesJson.pages ?? []);
        setFolders(foldersJson.folders ?? []);
      } finally {
        setLoading(false);
      }
    },
    [activeWorkspaceId],
  );

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  useEffect(() => {
    fetchAll(activeWorkspaceId);
  }, [activeWorkspaceId, fetchAll]);

  const handleWorkspaceChange = (id: string) => {
    setActiveWorkspaceIdState(id);
    setActiveWorkspaceId(id);
    setFilter("all");
  };

  const updateMeta = async (id: string, body: Record<string, unknown>) => {
    const res = await fetch(`/api/pages/${id}/meta`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const json = await res.json();
      alert(json.error || "저장에 실패했습니다.");
      return;
    }
    fetchAll();
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/pages/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json();
      alert(json.error || "휴지통으로 이동하지 못했습니다.");
      return;
    }
    fetchAll();
  };

  const handleRestore = async (id: string) => {
    const res = await fetch(`/api/pages/${id}/restore`, { method: "POST" });
    if (!res.ok) {
      const json = await res.json();
      alert(json.error || "복구에 실패했습니다.");
      return;
    }
    fetchAll();
  };

  const handlePermanentDelete = async (id: string) => {
    const res = await fetch(`/api/pages/${id}?permanent=true`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json();
      alert(json.error || "영구 삭제에 실패했습니다.");
      return;
    }
    fetchAll();
  };

  const handleToggleStar = (id: string, starred: boolean) => {
    updateMeta(id, { starred });
  };

  const handleRename = (id: string, currentName: string) => {
    const name = prompt("페이지 이름", currentName);
    if (name === null) return;
    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    updateMeta(id, { name: name.trim() });
  };

  const handleMoveToFolder = (id: string, folderId: string | null) => {
    updateMeta(id, { folderId });
  };

  const handleDuplicate = async (id: string) => {
    const res = await fetch(`/api/pages/${id}/duplicate`, { method: "POST" });
    const json = await res.json();
    if (!res.ok) {
      alert(json.error || "복제에 실패했습니다.");
      return;
    }
    fetchAll();
  };

  const handleSaveSettings = async (body: { published: boolean; expiresAt: string | null }) => {
    if (!settingsPage) return;
    const res = await fetch(`/api/pages/${settingsPage.id}/meta`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error || "저장에 실패했습니다.");
    }
    fetchAll();
  };

  const handleCreateWorkspace = async (name: string) => {
    const res = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error || "워크스페이스 생성에 실패했습니다.");
    }
    const json = await res.json();
    const created = json.workspace as Workspace;
    await fetchWorkspaces();
    handleWorkspaceChange(created.id);
  };

  const handleRenameWorkspace = async (workspace: Workspace) => {
    const name = prompt("워크스페이스 이름", workspace.name);
    if (!name?.trim()) return;
    const res = await fetch(`/api/workspaces/${workspace.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (!res.ok) {
      const json = await res.json();
      alert(json.error || "워크스페이스 수정에 실패했습니다.");
      return;
    }
    await fetchWorkspaces();
  };

  const handleDeleteWorkspace = async (workspace: Workspace) => {
    if (!confirm(`'${workspace.name}' 워크스페이스를 삭제할까요?\n(포함된 페이지·폴더도 함께 삭제됩니다)`)) {
      return;
    }
    const res = await fetch(`/api/workspaces/${workspace.id}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json();
      alert(json.error || "워크스페이스 삭제에 실패했습니다.");
      return;
    }
    if (workspace.id === activeWorkspaceId) {
      handleWorkspaceChange(PERSONAL_SCOPE_ID);
    }
    await fetchWorkspaces();
  };

  const handleCreateFolder = async (name: string) => {
    if (!activeWorkspaceId) throw new Error("페이지 공간을 선택해주세요.");
    const res = await fetch("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, workspaceId: activeWorkspaceId }),
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error || "폴더 생성에 실패했습니다.");
    }
    fetchAll();
  };

  const handleRenameFolder = async (folder: PageFolder) => {
    const name = prompt("폴더 이름", folder.name);
    if (!name?.trim()) return;
    const res = await fetch(`/api/folders/${folder.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (!res.ok) {
      const json = await res.json();
      alert(json.error || "폴더 수정에 실패했습니다.");
      return;
    }
    fetchAll();
  };

  const handleDeleteFolder = async (folder: PageFolder) => {
    if (!confirm(`'${folder.name}' 폴더를 삭제할까요?\n(페이지는 미분류로 이동됩니다)`)) return;
    await fetch(`/api/folders/${folder.id}`, { method: "DELETE" });
    if (filter === folder.id) setFilter("all");
    fetchAll();
  };

  const folderMap = useMemo(
    () => Object.fromEntries(folders.map((f) => [f.id, f.name])),
    [folders],
  );

  const filteredPages = useMemo(() => {
    if (filter === "starred") return pages.filter((p) => p.starred);
    if (filter !== "all") return pages.filter((p) => p.folderId === filter);
    return pages;
  }, [pages, filter]);

  const groupedSections = useMemo(() => {
    if (filter !== "all") return null;

    const starred = pages.filter((p) => p.starred);
    const sections: { key: string; title: string; pages: SavedPageRecord[]; isStarred?: boolean }[] = [];

    if (starred.length > 0) {
      sections.push({ key: "starred", title: "즐겨찾기", pages: starred, isStarred: true });
    }

    for (const folder of folders) {
      const items = pages.filter((p) => p.folderId === folder.id);
      if (items.length > 0) {
        sections.push({ key: folder.id, title: `📁 ${folder.name}`, pages: items });
      }
    }

    const uncategorized = pages.filter((p) => !p.folderId);
    if (uncategorized.length > 0) {
      sections.push({ key: "none", title: "📂 미분류", pages: uncategorized });
    }

    return sections;
  }, [pages, folders, filter]);

  const cardProps = {
    folders,
    onDelete: handleDelete,
    onToggleStar: handleToggleStar,
    onRename: handleRename,
    onMoveToFolder: handleMoveToFolder,
    onShowTrackingLogs: setTrackingLogsPage,
    onDuplicate: handleDuplicate,
    onOpenSettings: setSettingsPage,
  };

  const isTrashView = isTrashScope(activeWorkspaceId);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const scopeTitle = isTrashView
    ? "휴지통"
    : isPersonalScope(activeWorkspaceId)
      ? "내 페이지"
      : (activeWorkspace?.name ?? "워크스페이스");
  const scopeSubtitle = isTrashView
    ? `삭제한 페이지는 ${TRASH_RETENTION_DAYS}일 동안 보관되며 복구할 수 있습니다`
    : isPersonalScope(activeWorkspaceId)
      ? "나만 보는 개인 페이지를 관리합니다"
      : "팀과 함께 공유하는 페이지를 관리합니다";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
      <DashboardSidebar
        workspaces={workspaces}
        activeId={activeWorkspaceId}
        onChange={handleWorkspaceChange}
        onCreateWorkspace={() => setCreateWorkspaceOpen(true)}
        onRenameWorkspace={handleRenameWorkspace}
        onDeleteWorkspace={handleDeleteWorkspace}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold text-gray-900">{scopeTitle}</h1>
              <p className="mt-0.5 text-sm text-gray-500">{scopeSubtitle}</p>
            </div>
            {!isTrashView && (
              <Link
                href="/create"
                className="shrink-0 rounded-full bg-[#ff4d6d] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#e63956]"
              >
                + 새 페이지
              </Link>
            )}
          </div>
        </div>

        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
      {loading ? (
        <p className="mt-8 text-center text-gray-400">불러오는 중...</p>
      ) : isTrashView ? (
        pages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <p className="text-lg font-medium text-gray-700">휴지통이 비어 있습니다</p>
            <p className="mt-2 text-sm text-gray-400">
              삭제한 페이지가 {TRASH_RETENTION_DAYS}일 동안 여기에 보관됩니다
            </p>
          </div>
        ) : (
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            {pages.map((page) => (
              <TrashPageCard
                key={page.id}
                page={page}
                workspaces={workspaces}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
              />
            ))}
          </div>
        )
      ) : pages.length === 0 && folders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <p className="text-lg font-medium text-gray-700">아직 페이지가 없습니다</p>
          <p className="mt-2 text-sm text-gray-400">템플릿을 선택하고 첫 페이지를 배포해보세요</p>
          <Link
            href="/create"
            className="mt-6 inline-block rounded-full bg-[#ff4d6d] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#e63956]"
          >
            첫 페이지 만들기
          </Link>
        </div>
      ) : (
        <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-[#ff4d6d]"
          }`}
        >
          전체
        </button>
        <button
          type="button"
          onClick={() => setFilter("starred")}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            filter === "starred"
              ? "bg-gradient-to-r from-[#ff4d6d] to-[#7c3aed] text-white shadow-sm"
              : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-[#ff4d6d]"
          }`}
        >
          <StarIcon
            filled={filter === "starred"}
            variant={filter === "starred" ? "white" : "muted"}
            size={14}
          />
          즐겨찾기
        </button>
        {folders.map((folder) => (
          <div key={folder.id} className="group flex items-center">
            <button
              type="button"
              onClick={() => setFilter(folder.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === folder.id
                  ? "bg-[#ff4d6d] text-white"
                  : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-[#ff4d6d]"
              }`}
            >
              📁 {folder.name}
            </button>
            <div className="ml-0.5 hidden items-center gap-0.5 group-hover:flex">
              <button
                type="button"
                onClick={() => handleRenameFolder(folder)}
                className="rounded p-1 text-xs text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="폴더 이름 변경"
              >
                ✏️
              </button>
              <button
                type="button"
                onClick={() => handleDeleteFolder(folder)}
                className="rounded p-1 text-xs text-gray-400 hover:bg-red-50 hover:text-red-500"
                aria-label="폴더 삭제"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setCreateFolderOpen(true)}
          className="rounded-full border border-dashed border-gray-300 px-3 py-1.5 text-sm text-gray-500 hover:border-[#ff4d6d] hover:text-[#ff4d6d]"
        >
          + 새 폴더
        </button>
      </div>

      {filter !== "all" && (
        <p className="mt-4 text-sm text-gray-500">
          {filter === "starred"
            ? `즐겨찾기 ${filteredPages.length}개`
            : `📁 ${folderMap[filter] ?? ""} · ${filteredPages.length}개`}
        </p>
      )}

      {filteredPages.length === 0 ? (
        <p className="mt-10 text-center text-gray-400">표시할 페이지가 없습니다.</p>
      ) : filter === "all" && groupedSections ? (
        <div className="mt-6 space-y-8">
          {groupedSections.map((section) => (
            <section key={section.key}>
              <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                {section.isStarred ? (
                  <>
                    <StarIcon filled size={14} />
                    {section.title}
                  </>
                ) : (
                  section.title
                )}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {section.pages.map((page) => (
                  <PageCard key={page.id} page={page} {...cardProps} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filteredPages.map((page) => (
            <PageCard key={page.id} page={page} {...cardProps} />
          ))}
        </div>
      )}

        </>
      )}
        </div>
      </div>

      <FolderCreateModal
        open={createFolderOpen}
        onClose={() => setCreateFolderOpen(false)}
        onCreate={handleCreateFolder}
      />

      <WorkspaceCreateModal
        open={createWorkspaceOpen}
        onClose={() => setCreateWorkspaceOpen(false)}
        onCreate={handleCreateWorkspace}
      />

      <TrackingLogsModal
        open={!!trackingLogsPage}
        pageId={trackingLogsPage?.id ?? null}
        pageName={trackingLogsPage?.name ?? ""}
        onClose={() => setTrackingLogsPage(null)}
      />

      <PageSettingsModal
        open={!!settingsPage}
        page={settingsPage}
        onClose={() => setSettingsPage(null)}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
