import type { PageData } from "@/lib/types";
import {
  PageBanner,
  PageCta,
  PageCustomCss,
  PageDescription,
  PageFeatures,
  PageMeta,
  PageShell,
  PageTitle,
  PageWatermark,
  usePageStyles,
} from "./shared";

export default function SplitLayout({
  data,
  showWatermark,
}: {
  data: PageData;
  showWatermark: boolean;
}) {
  const styles = usePageStyles(data);

  return (
    <PageShell bg={styles.bg} fontFamily={styles.fontFamily}>
      <PageCustomCss css={data.customCss} />
      {/* 모바일: 세로 스택 / 태블릿·PC(md+): 좌우 분할 */}
      <div className="flex min-w-0 flex-col md:min-h-[28rem] md:flex-row">
        <div className="relative w-full md:min-h-[28rem] md:w-1/2">
          <PageBanner
            data={data}
            className="md:absolute md:inset-0 md:h-full md:min-h-full"
          />
        </div>
        <div
          className={`flex min-w-0 flex-1 flex-col justify-center px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-10 ${styles.align}`}
        >
          <PageTitle data={data} styles={styles} />
          <PageMeta data={data} styles={styles} className="mt-6" />
          <PageDescription data={data} styles={styles} className="mt-6" />
          <PageFeatures data={data} styles={styles} className="mt-6" />
          <PageCta data={data} styles={styles} className="mt-8" />
        </div>
      </div>
      <PageWatermark dark={styles.dark} show={showWatermark} />
    </PageShell>
  );
}
