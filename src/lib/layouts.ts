import type { LayoutId, PageData } from "./types";

export interface LayoutDefinition {
  id: LayoutId;
  name: string;
  description: string;
  styleHints?: Partial<
    Pick<PageData, "bannerHeight" | "textAlign" | "titleSize" | "bannerFit">
  >;
}

export const LAYOUTS: LayoutDefinition[] = [
  {
    id: "classic",
    name: "클래식",
    description: "배너 상단 + 본문 하단",
    styleHints: { bannerHeight: "md", textAlign: "left" },
  },
  {
    id: "hero-overlay",
    name: "히어로 오버레이",
    description: "제목이 배너 위에 크게",
    styleHints: { bannerHeight: "lg", textAlign: "center", titleSize: "lg" },
  },
  {
    id: "split",
    name: "스플릿",
    description: "배너와 본문 좌우 분할",
    styleHints: { bannerHeight: "md", textAlign: "left" },
  },
  {
    id: "minimal",
    name: "미니멀",
    description: "텍스트 중심, 작은 이미지",
    styleHints: { bannerHeight: "sm", textAlign: "left", titleSize: "lg" },
  },
  {
    id: "magazine",
    name: "매거진",
    description: "제목 먼저, 넓은 배너",
    styleHints: { bannerHeight: "lg", textAlign: "left", titleSize: "lg" },
  },
  {
    id: "card",
    name: "카드",
    description: "중앙 카드형 레이아웃",
    styleHints: { bannerHeight: "md", textAlign: "center", titleSize: "md" },
  },
];

export function getLayoutById(id: LayoutId): LayoutDefinition {
  return LAYOUTS.find((l) => l.id === id) ?? LAYOUTS[0];
}

export function applyLayout(data: PageData, layoutId: LayoutId): PageData {
  const layout = getLayoutById(layoutId);
  return {
    ...data,
    layoutId,
    ...(layout.styleHints ?? {}),
  };
}
