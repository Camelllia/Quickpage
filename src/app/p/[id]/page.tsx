import EventPageRenderer from "@/components/EventPageRenderer";
import PublishedPageClient from "@/components/PublishedPageClient";
import { getPageById as getSamplePage } from "@/lib/data";
import { getPublishedPage, getPublishedPageRecordForUser } from "@/lib/pages-service";
import { isValidPageId } from "@/lib/page-id";
import TrackingRecorder from "@/components/TrackingRecorder";
import TrackingOwnerPanel from "@/components/TrackingOwnerPanel";
import { getSessionUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = isValidPageId(id)
    ? ((await getPublishedPage(id)) ?? getSamplePage(id))
    : undefined;
  if (!page) return { title: "페이지를 찾을 수 없습니다" };
  return {
    title: `${page.title} | 퀵페이지`,
    description: page.subtitle,
  };
}

export default async function PublishedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionUser = await getSessionUser();

  if (isValidPageId(id)) {
    const page = (await getPublishedPage(id)) ?? getSamplePage(id);
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
