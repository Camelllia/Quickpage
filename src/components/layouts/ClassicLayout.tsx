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

export default function ClassicLayout({
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
      <PageBanner data={data} />
      <PageContent align={styles.align}>
        <PageTitle data={data} styles={styles} />
        <PageMeta data={data} styles={styles} className="mt-6" />
        <PageDescription data={data} styles={styles} className="mt-8" />
        <PageFeatures data={data} styles={styles} className="mt-8" />
        <PageCta data={data} styles={styles} className="mt-10" />
      </PageContent>
      <PageWatermark dark={styles.dark} show={showWatermark} />
    </PageShell>
  );
}
