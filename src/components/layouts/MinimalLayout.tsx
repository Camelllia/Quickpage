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

export default function MinimalLayout({
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
      <div className="h-1.5 w-full" style={{ backgroundColor: data.accentColor }} />
      <PageContent align={styles.align}>
        <PageTitle data={data} styles={styles} />
        <PageMeta data={data} styles={styles} className="mt-6 sm:mt-8" />
        <PageDescription data={data} styles={styles} className="mt-6 text-base sm:mt-8 sm:text-lg" />
        <div className="mt-6 overflow-hidden rounded-xl sm:mt-8 sm:rounded-2xl">
          <PageBanner data={{ ...data, bannerHeight: "sm" }} overlayClass="absolute inset-0 bg-black/10" />
        </div>
        <PageFeatures data={data} styles={styles} className="mt-8 sm:mt-10" />
        <PageCta data={data} styles={styles} className="mt-8 sm:mt-10" />
      </PageContent>
      <PageWatermark dark={styles.dark} show={showWatermark} />
    </PageShell>
  );
}
