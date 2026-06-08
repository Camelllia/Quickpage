import EventPageRenderer from "@/components/EventPageRenderer";
import PageUnavailable from "@/components/PageUnavailable";
import PublishedPageClient from "@/components/PublishedPageClient";
import { getPageById as getSamplePage } from "@/lib/data";
import {
  getPagePublicStatus,
  getPublishedPage,
  getPublishedPageRecordForUser,
} from "@/lib/pages-service";
import { buildPageMetadata } from "@/lib/page-metadata";
import { isValidPageId } from "@/lib/page-id";
import type { PageBlockReason } from "@/lib/page-lifecycle";
import TrackingRecorder from "@/components/TrackingRecorder";
import TrackingOwnerPanel from "@/components/TrackingOwnerPanel";
import { getSessionUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidPageId(id)) return { title: "페이지를 찾을 수 없습니다" };

  const sample = getSamplePage(id);
  if (sample) return buildPageMetadata(sample, id);

  const page = await getPublishedPage(id);
  if (!page) return { title: "페이지를 찾을 수 없습니다" };
  return buildPageMetadata(page, id);
}

export default async function PublishedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionUser = await getSessionUser();

  if (isValidPageId(id)) {
    const sample = getSamplePage(id);
    if (sample) {
      return (
        <>
          <EventPageRenderer data={sample} />
          <TrackingRecorder pageId={id} />
        </>
      );
    }

    const status = await getPagePublicStatus(id);
    if (status === "unpublished" || status === "expired") {
      return <PageUnavailable reason={status as PageBlockReason} />;
    }

    const page = await getPublishedPage(id);
    if (page) {
      const isOwner = !!(await getPublishedPageRecordForUser(id, sessionUser?.id ?? null));
      return (
        <>
          <EventPageRenderer data={page} />
          <TrackingRecorder pageId={id} />
          {isOwner && <TrackingOwnerPanel pageId={id} />}
        </>
      );
    }
  }

  return <PublishedPageClient id={id} />;
}
