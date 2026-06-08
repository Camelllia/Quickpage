import type { PageData } from "./types";

export interface ThemePreset {
  id: string;
  name: string;
  accentColor: string;
  backgroundColor: string;
  ctaStyle: PageData["ctaStyle"];
}

export const themePresets: ThemePreset[] = [
  { id: "rose", name: "로즈", accentColor: "#f43f5e", backgroundColor: "#ffffff", ctaStyle: "filled" },
  { id: "violet", name: "바이올렛", accentColor: "#8b5cf6", backgroundColor: "#faf5ff", ctaStyle: "filled" },
  { id: "ocean", name: "오션", accentColor: "#0891b2", backgroundColor: "#f0fdfa", ctaStyle: "filled" },
  { id: "sunset", name: "선셋", accentColor: "#ea580c", backgroundColor: "#fff7ed", ctaStyle: "filled" },
  { id: "forest", name: "포레스트", accentColor: "#16a34a", backgroundColor: "#f0fdf4", ctaStyle: "outline" },
  { id: "midnight", name: "미드나잇", accentColor: "#6366f1", backgroundColor: "#0f172a", ctaStyle: "filled" },
];
