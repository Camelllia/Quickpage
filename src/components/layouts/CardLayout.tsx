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

export default function CardLayout({
  data,
  showWatermark,
}: {
  data: PageData;
  showWatermark: boolean;
}) {
  const styles = usePageStyles(data);

  return (
    <PageShell
      bg={styles.dark ? styles.bg : "#f3f4f6"}
      fontFamily={styles.fontFamily}
      className="px-3 py-6 sm:px-4 sm:py-10"
    >
      <PageCustomCss css={data.customCss} />
      <div
        className={`mx-auto w-full max-w-lg overflow-hidden rounded-xl shadow-xl sm:rounded-2xl ${
          styles.dark ? "border border-white/10" : "bg-white"
        }`}
        style={{ backgroundColor: styles.dark ? styles.bg : "#ffffff" }}
      >
        <PageBanner data={data} />
        <div className={`min-w-0 px-4 py-6 sm:px-6 sm:py-8 ${styles.align}`}>
          <PageTitle data={data} styles={styles} />
          <PageMeta data={data} styles={styles} className="mt-6" />
          <PageDescription data={data} styles={styles} className="mt-6" />
          <PageFeatures data={data} styles={styles} className="mt-8" />
          <PageCta data={data} styles={styles} className="mt-8" />
        </div>
      </div>
      <PageWatermark dark={false} show={showWatermark} />
    </PageShell>
  );
}
