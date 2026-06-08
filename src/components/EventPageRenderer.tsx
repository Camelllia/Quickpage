import PageFontLoader from "@/components/PageFontLoader";
import { normalizePageData } from "@/lib/normalize-page-data";
import type { PageData } from "@/lib/types";
import CardLayout from "./layouts/CardLayout";
import ClassicLayout from "./layouts/ClassicLayout";
import HeroOverlayLayout from "./layouts/HeroOverlayLayout";
import MagazineLayout from "./layouts/MagazineLayout";
import MinimalLayout from "./layouts/MinimalLayout";
import SplitLayout from "./layouts/SplitLayout";

interface EventPageRendererProps {
  data: PageData;
  showWatermark?: boolean;
}

export default function EventPageRenderer({ data, showWatermark = true }: EventPageRendererProps) {
  const page = normalizePageData(data);

  const layout = (() => {
    switch (page.layoutId) {
    case "hero-overlay":
      return <HeroOverlayLayout data={page} showWatermark={showWatermark} />;
    case "split":
      return <SplitLayout data={page} showWatermark={showWatermark} />;
    case "minimal":
      return <MinimalLayout data={page} showWatermark={showWatermark} />;
    case "magazine":
      return <MagazineLayout data={page} showWatermark={showWatermark} />;
    case "card":
      return <CardLayout data={page} showWatermark={showWatermark} />;
    case "classic":
    default:
      return <ClassicLayout data={page} showWatermark={showWatermark} />;
    }
  })();

  return (
    <>
      <PageFontLoader fontId={page.fontFamily} />
      {layout}
    </>
  );
}
