import type { BannerFit, BannerHeight } from "./types";

export const BANNER_HEIGHT_CLASSES: Record<BannerHeight, string> = {
  sm: "h-40 sm:h-48 md:h-56",
  md: "h-56 sm:h-72 md:h-96",
  lg: "h-64 sm:h-80 md:h-[28rem]",
};

export const BANNER_HEIGHT_PREVIEW: Record<BannerHeight, string> = {
  sm: "h-28",
  md: "h-36",
  lg: "h-44",
};

export function getBannerImageStyle(focusY: number, fit: BannerFit) {
  return {
    objectFit: fit as "cover" | "contain",
    objectPosition: `center ${focusY}%`,
  };
}
