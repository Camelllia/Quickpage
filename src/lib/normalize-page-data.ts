import { DEFAULT_FONT_ID, isValidFontId } from "./fonts";
import type { LayoutId, PageData } from "./types";

const VALID_LAYOUTS: LayoutId[] = [
  "classic",
  "hero-overlay",
  "split",
  "minimal",
  "magazine",
  "card",
];

export function normalizePageData(data: PageData): PageData {
  const layoutId =
    data.layoutId && VALID_LAYOUTS.includes(data.layoutId) ? data.layoutId : "classic";
  const fontFamily =
    data.fontFamily && isValidFontId(data.fontFamily) ? data.fontFamily : DEFAULT_FONT_ID;

  return { ...data, layoutId, fontFamily };
}
