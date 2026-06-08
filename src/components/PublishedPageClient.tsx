"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import EventPageRenderer from "@/components/EventPageRenderer";
import PageUnavailable from "@/components/PageUnavailable";
import TrackingRecorder from "@/components/TrackingRecorder";
import type { PageBlockReason } from "@/lib/page-lifecycle";
import type { PageData } from "@/lib/types";

interface PublishedPageClientProps {
  id?: string;
  showWatermark?: boolean;
}

export default function PublishedPageClient({ id: idProp, showWatermark = true }: PublishedPageClientProps) {
  const params = useParams();
  const id = (params?.id as string) || idProp || "";
  const [state, setState] = useState<
    | { kind: "loading" }
    | { kind: "ok"; data: PageData }
    | { kind: "blocked"; reason: PageBlockReason }
    | { kind: "missing" }
  >({ kind: "loading" });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/pages/${encodeURIComponent(id)}`)
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (res.ok && json.data) {
          setState({ kind: "ok", data: json.data as PageData });
          return;
        }
        if (res.status === 403 && (json.reason === "expired" || json.reason === "unpublished")) {
          setState({ kind: "blocked", reason: json.reason });
          return;
        }
        setState({ kind: "missing" });
      })
      .catch(() => setState({ kind: "missing" }));
  }, [id]);

  if (state.kind === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-400">
        페이지 불러오는 중...
      </div>
    );
  }

  if (state.kind === "blocked") {
    return <PageUnavailable reason={state.reason} />;
  }

  if (state.kind === "missing") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-gray-500">
        <p className="text-lg font-medium">페이지를 찾을 수 없습니다</p>
        <Link href="/create" className="text-sm text-[#ff4d6d] hover:underline">
          새 페이지 만들기 →
        </Link>
      </div>
    );
  }

  return (
    <>
      <EventPageRenderer data={state.data} showWatermark={showWatermark} />
      <TrackingRecorder pageId={id} />
    </>
  );
}
