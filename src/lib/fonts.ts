import type { FontFamilyId } from "./types";

export interface FontDefinition {
  id: FontFamilyId;
  name: string;
  description: string;
  family: string;
  /** 웹폰트 로드 URL (없으면 앱 기본 Pretendard 사용) */
  href: string | null;
}

export const DEFAULT_FONT_ID: FontFamilyId = "pretendard";

export const FONTS: FontDefinition[] = [
  {
    id: "pretendard",
    name: "프리텐다드",
    description: "깔끔한 기본 산세리프",
    family: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    href: null,
  },
  {
    id: "noto-sans",
    name: "노토 산스",
    description: "가독성 좋은 고딕",
    family: '"Noto Sans KR", sans-serif',
    href: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800&display=swap",
  },
  {
    id: "noto-serif",
    name: "노토 세리프",
    description: "차분한 명조 느낌",
    family: '"Noto Serif KR", serif',
    href: "https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700&display=swap",
  },
  {
    id: "nanum-gothic",
    name: "나눔고딕",
    description: "친숙한 고딕",
    family: '"Nanum Gothic", sans-serif',
    href: "https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap",
  },
  {
    id: "gowun-batang",
    name: "고운바탕",
    description: "부드러운 바탕체",
    family: '"Gowun Batang", serif',
    href: "https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&display=swap",
  },
  {
    id: "black-han-sans",
    name: "블랙 한산스",
    description: "강한 임팩트 제목용",
    family: '"Black Han Sans", sans-serif',
    href: "https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap",
  },
  {
    id: "jua",
    name: "주아",
    description: "라운드한 캐주얼",
    family: '"Jua", sans-serif',
    href: "https://fonts.googleapis.com/css2?family=Jua&display=swap",
  },
];

const PRETENDARD_CDN =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css";

export function isValidFontId(id: string | undefined): id is FontFamilyId {
  return FONTS.some((f) => f.id === id);
}

export function getFontById(id: FontFamilyId | string | undefined): FontDefinition {
  return FONTS.find((f) => f.id === id) ?? FONTS[0];
}

/** 독립 HTML 추출용 스타일시트 링크 */
export function getFontStylesheetLink(id: FontFamilyId | string | undefined): string {
  const font = getFontById(id);
  if (font.id === "pretendard") return PRETENDARD_CDN;
  return font.href ?? PRETENDARD_CDN;
}
