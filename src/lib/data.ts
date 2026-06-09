import { getTemplatePreset } from "./template-presets";
import type { PageData, PricingPlan, Template } from "./types";

export { getTemplatePreset, getAllTemplatePresets } from "./template-presets";

export const templates: Template[] = [
  {
    id: "event-classic",
    name: "이벤트 클래식",
    category: "이벤트",
    description: "배너 + 제목 + 날짜 + 신청 CTA",
    gradient: "from-rose-400 via-pink-300 to-orange-200",
    tags: ["이벤트", "신청"],
    popular: true,
  },
  {
    id: "recruit",
    name: "모집 공고",
    category: "모집",
    description: "강사·직원 모집에 최적화된 레이아웃",
    gradient: "from-violet-400 via-purple-300 to-indigo-200",
    tags: ["모집", "공고"],
  },
  {
    id: "sale",
    name: "세일 프로모션",
    category: "세일",
    description: "할인율과 기간을 강조하는 프로모션",
    gradient: "from-amber-400 via-yellow-300 to-lime-200",
    tags: ["세일", "할인"],
    popular: true,
  },
  {
    id: "notice",
    name: "공지 안내",
    category: "공지",
    description: "운영 시간·일정 변경 공지용",
    gradient: "from-sky-400 via-cyan-300 to-teal-200",
    tags: ["공지", "안내"],
  },
  {
    id: "opening",
    name: "오픈 예정",
    category: "오픈",
    description: "신규 매장·서비스 오픈 카운트다운",
    gradient: "from-fuchsia-400 via-pink-300 to-rose-200",
    tags: ["오픈", "런칭"],
  },
  {
    id: "workshop",
    name: "워크샵",
    category: "이벤트",
    description: "세미나·워크샵 참가 신청 페이지",
    gradient: "from-emerald-400 via-green-300 to-lime-200",
    tags: ["워크샵", "세미나"],
  },
];

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "월",
    description: "이벤트 페이지를 만드는 가장 쉬운 방법, Quickpage를 처음 시작하는 모든 분을 위한 요금제입니다.",
    features: [
      "페이지 10개",
      "기본 템플릿 3종",
      "Quickpage 워터마크",
      "Quickpage 공유 링크로 배포",
    ],
    cta: "무료로 시작하기",
  },
  {
    id: "pro",
    name: "Pro",
    price: 9900,
    period: "월",
    description: "마케터·운영 담당자를 위한 핵심 플랜",
    features: [
      "페이지 200개",
      "전체 템플릿 이용",
      "Low-code 템플릿 직접 수정",
      "분석 대시보드",
      "워터마크 제거",
    ],
    highlighted: true,
    cta: "Pro 시작하기",
  },
  {
    id: "business",
    name: "Business",
    price: 29000,
    period: "월",
    description: "팀·에이전시를 위한 확장 플랜",
    features: [
      "무제한 페이지",
      "팀 계정 10명",
      "화이트라벨",
      "API 연동",
      "대량 추출·일괄보내기",
      "커스텀 도메인 연결",
    ],
    cta: "문의하기",
  },
];

export const SAMPLE_PAGE_IDS = {
  springEvent: "a0000001-0000-4000-8000-000000000001",
  academyRecruit: "a0000001-0000-4000-8000-000000000002",
} as const;

export const samplePages: { id: string; data: PageData }[] = [
  { id: SAMPLE_PAGE_IDS.springEvent, data: getTemplatePreset("event-classic") },
  { id: SAMPLE_PAGE_IDS.academyRecruit, data: getTemplatePreset("recruit") },
];

export function getPageById(id: string): PageData | undefined {
  return samplePages.find((p) => p.id === id)?.data;
}

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export const defaultPageData: PageData = getTemplatePreset("event-classic");
