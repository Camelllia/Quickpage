"use client";

import TrashPageActionsMenu from "@/components/TrashPageActionsMenu";
import { formatTrashRemaining, TRASH_RETENTION_DAYS } from "@/lib/page-trash";
import type { SavedPageRecord, Workspace } from "@/lib/types";

export default function TrashPageCard({
  page,
  workspaces,
  onRestore,
  onPermanentDelete,
}: {
  page: SavedPageRecord;
  workspaces: Workspace[];
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
}) {
  const scopeLabel = page.workspaceId
    ? (workspaces.find((w) => w.id === page.workspaceId)?.name ?? "워크스페이스")
    : "개인";
  const deletedLabel = page.deletedAt ? formatTrashRemaining(page.deletedAt) : "";

  return (
    <div className="card-hover relative rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div
        className="absolute top-3 right-3 z-10"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <TrashPageActionsMenu
          data={page.data}
          displayName={page.name}
          onRestore={() => onRestore(page.id)}
          onPermanentDelete={() => onPermanentDelete(page.id)}
        />
      </div>
      <div className="block">
        <div
          className="h-32 overflow-hidden rounded-t-2xl bg-cover bg-center opacity-80"
          style={{ backgroundImage: `url(${page.data.bannerUrl})` }}
        />
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-2 pr-10">
            <h3 className="font-bold text-gray-900">{page.name}</h3>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
              {scopeLabel}
            </span>
          </div>
          {page.name !== page.data.title && (
            <p className="mt-0.5 text-xs text-gray-400">페이지 제목: {page.data.title}</p>
          )}
          <p className="mt-1 line-clamp-1 text-sm text-gray-500">{page.data.subtitle}</p>
          <p className="mt-3 text-xs text-gray-400">
            삭제일 {page.deletedAt ? new Date(page.deletedAt).toLocaleString("ko-KR") : "-"}
            {deletedLabel ? ` · ${deletedLabel}` : ""}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-400">
            휴지통에 {TRASH_RETENTION_DAYS}일 보관 후 자동 영구 삭제됩니다
          </p>
        </div>
      </div>
    </div>
  );
}
