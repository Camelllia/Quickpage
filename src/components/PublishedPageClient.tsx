"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import EventPageRenderer from "@/components/EventPageRenderer";
import TrackingRecorder from "@/components/TrackingRecorder";
import type { PageData } from "@/lib/types";

interface PublishedPageClientProps {
  id?: string;
  showWatermark?: boolean;
}

export default function PublishedPageClient({ id: idProp, showWatermark = true }: PublishedPageClientProps) {
  const params = useParams();
  const id = (params?.id as string) || idProp || "";
  const [data, setData] = useState<PageData | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/pages/${encodeURIComponent(id)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => setData(json?.data ?? null))
      .catch(() => setData(null));
  }, [id]);

  if (data === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-400">
        페이지 불러오는 중...
      </div>
    );
  }

  if (!data) {
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
      <EventPageRenderer data={data} showWatermark={showWatermark} />
      <TrackingRecorder pageId={id} />
    </>
  );
}
