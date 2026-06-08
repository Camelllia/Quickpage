import type { PageData } from "./types";

export const TITLE_SIZE_CLASSES: Record<PageData["titleSize"], string> = {
  sm: "text-2xl sm:text-3xl",
  md: "text-3xl sm:text-4xl",
  lg: "text-4xl sm:text-5xl",
};

export const CTA_SIZE_CLASSES: Record<PageData["ctaSize"], string> = {
  sm: "px-5 py-2.5 text-sm sm:px-6",
  md: "px-6 py-3 text-base sm:px-10 sm:py-4 sm:text-lg",
  lg: "px-8 py-3.5 text-lg sm:px-12 sm:py-5 sm:text-xl",
};

export function isDarkBackground(bg: string): boolean {
  const hex = bg.replace("#", "");
  if (hex.length !== 6) return false;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}
