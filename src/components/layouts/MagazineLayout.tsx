import type { PageData } from "@/lib/types";
import {
  PageBanner,
  PageContent,
  PageCta,
  PageCustomCss,
  PageDescription,
  PageFeatures,
  PageMeta,
  PageShell,
  PageTitle,
  PageWatermark,
  PROSE_BODY,
  usePageStyles,
} from "./shared";

export default function MagazineLayout({
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
      <div className={`mx-auto w-full min-w-0 max-w-3xl px-4 pt-8 sm:px-6 sm:pt-12 md:px-8 ${styles.align} ${PROSE_BODY}`}>
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: data.accentColor }}>
          Event
        </p>
        <PageTitle data={data} styles={styles} className="mt-3" />
      </div>
      <div className="mt-6 sm:mt-8">
        <PageBanner data={data} />
      </div>
      <PageContent align={styles.align} wide>
        <div className="flex flex-col gap-6 sm:gap-8">
          <PageMeta data={data} styles={styles} />
          <PageDescription data={data} styles={styles} />
        </div>
        <PageFeatures data={data} styles={styles} className="mt-8 sm:mt-10" />
        <PageCta data={data} styles={styles} className="mt-8 sm:mt-10" />
      </PageContent>
      <PageWatermark dark={styles.dark} show={showWatermark} />
    </PageShell>
  );
}
