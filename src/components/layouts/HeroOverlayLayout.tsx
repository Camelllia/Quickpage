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
  usePageStyles,
} from "./shared";

export default function HeroOverlayLayout({
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
      <PageBanner
        data={data}
        overlayClass="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"
      >
        <div
          className={`absolute inset-0 flex flex-col justify-end px-4 pb-8 pt-12 sm:px-6 sm:pb-10 sm:pt-16 ${styles.align}`}
        >
          <div className="mx-auto w-full min-w-0 max-w-2xl">
            <PageTitle data={data} styles={styles} light />
          </div>
        </div>
      </PageBanner>
      <PageContent align={styles.align}>
        <PageMeta data={data} styles={styles} />
        <PageDescription data={data} styles={styles} className="mt-8" />
        <PageFeatures data={data} styles={styles} className="mt-8" />
        <PageCta data={data} styles={styles} className="mt-10" />
      </PageContent>
      <PageWatermark dark={styles.dark} show={showWatermark} />
    </PageShell>
  );
}
