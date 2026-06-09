import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";
import type { PageBlockReason } from "@/lib/page-lifecycle";
import { blockReasonMessage } from "@/lib/page-lifecycle";

export default function PageUnavailable({ reason }: { reason: PageBlockReason }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50 px-4 text-center">
      <p className="text-4xl" aria-hidden>
        {reason === "expired" ? "⏱️" : "🔒"}
      </p>
      <p className="text-lg font-semibold text-gray-800">{blockReasonMessage(reason)}</p>
      <p className="max-w-sm text-sm text-gray-500">
        {reason === "expired"
          ? "이벤트가 종료되어 더 이상 공개되지 않습니다."
          : "페이지 소유자가 공개를 중단했습니다."}
      </p>
      <Link
        href="/"
        className="mt-4 rounded-full bg-[#ff4d6d] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e63956]"
      >
        {BRAND_NAME} 홈으로
      </Link>
    </div>
  );
}
