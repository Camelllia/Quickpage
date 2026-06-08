import { defaultSections } from "./defaults";
import type { FontFamilyId, PageData } from "./types";

type PresetData = Omit<PageData, "fontFamily"> & { fontFamily?: FontFamilyId };

const presets: Record<string, PresetData> = {
  "event-classic": {
    templateId: "event-classic",
    layoutId: "classic",
    title: "봄맞이 오프라인 네트워킹 데이",
    subtitle: "업계 전문가와 함께하는 반나절 특별 이벤트",
    bannerUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=600&fit=crop",
    bannerHeight: "md",
    bannerFocusY: 45,
    bannerFit: "cover",
    eventDate: "2026년 4월 20일 (일) 14:00 ~ 18:00",
    eventLocation: "서울 강남구 코엑스 컨퍼런스룸 B홀",
    description:
      "따뜻한 봄을 맞이해 업계 리더와 실무자가 한자리에 모입니다. 키노트, 네트워킹, 현장 경품 추첨까지—바쁜 일정 속에서도 의미 있는 연결을 만들어 보세요.",
    featuresTitle: "참가 혜택",
    features: [
      "선착순 80명 웰컴 키트 증정",
      "현장 추첨 경품 (최대 30만원)",
      "전문가 패널 토크 무료 참관",
      "네트워킹 타임 & 다과 제공",
    ],
    ctaText: "무료 참가 신청하기",
    ctaUrl: "#apply",
    accentColor: "#f43f5e",
    backgroundColor: "#ffffff",
    textAlign: "left",
    titleSize: "md",
    ctaStyle: "filled",
    ctaSize: "md",
    sections: { ...defaultSections },
    customCss: `.quickpage-render h1 { letter-spacing: -0.03em; }
.quickpage-render .mt-6 { border-left: 4px solid #f43f5e; padding-left: 1rem; }`,
  },

  recruit: {
    templateId: "recruit",
    layoutId: "hero-overlay",
    title: "2026 상반기 영업·마케팅 인재 채용",
    subtitle: "함께 성장할 열정적인 동료를 찾습니다",
    bannerUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop",
    bannerHeight: "md",
    bannerFocusY: 35,
    bannerFit: "cover",
    eventDate: "채용 기간: 2026.03.01 ~ 04.30",
    eventLocation: "서울 본사 (재택·하이브리드 근무 가능)",
    description:
      "빠르게 성장하는 팀에서 브랜드 마케팅과 영업 전략을 함께 설계할 인재를 모집합니다. 성과 중심의 문화와 체계적인 온보딩을 제공합니다.",
    featuresTitle: "이런 분을 기다립니다",
    features: [
      "B2B/B2C 마케팅 경력 2년 이상",
      "데이터 기반 의사결정에 익숙한 분",
      "스타트업 환경에서 주도적으로 일해본 분",
      "포트폴리오·성과 사례 제출 가능",
    ],
    ctaText: "지원서 작성하기",
    ctaUrl: "#apply",
    accentColor: "#8b5cf6",
    backgroundColor: "#faf5ff",
    textAlign: "center",
    titleSize: "lg",
    ctaStyle: "filled",
    ctaSize: "lg",
    sections: { ...defaultSections },
    customCss: `.quickpage-render h1 { line-height: 1.2; }
.quickpage-render .mt-6 { border-radius: 1rem; border: 1px solid #e9d5ff; background: #f5f3ff; }`,
  },

  sale: {
    templateId: "sale",
    layoutId: "magazine",
    title: "여름 시즌 최대 50% 할인",
    subtitle: "단 7일간, 선착순 200명 한정 특가",
    bannerUrl:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop",
    bannerHeight: "lg",
    bannerFocusY: 50,
    bannerFit: "cover",
    eventDate: "2026.06.01 (월) ~ 06.07 (일)",
    eventLocation: "온라인 스토어 전 상품 대상",
    description:
      "베스트셀러부터 신상품까지 한정 기간 특가를 만나보세요. 쿠폰 중복 적용 가능한 상품도 포함되어 있으니 놓치지 마세요!",
    featuresTitle: "특가 혜택",
    features: [
      "인기 상품 최대 50% 할인",
      "5만원 이상 구매 시 무료 배송",
      "2개 이상 구매 시 추가 10% 할인",
      "선착순 200명 5,000원 쿠폰 증정",
    ],
    ctaText: "지금 바로 쇼핑하기",
    ctaUrl: "#shop",
    accentColor: "#ea580c",
    backgroundColor: "#fffbeb",
    textAlign: "center",
    titleSize: "lg",
    ctaStyle: "filled",
    ctaSize: "lg",
    sections: {
      showEventDate: true,
      showEventLocation: false,
      showDescription: true,
      showFeatures: true,
      showCta: true,
    },
    customCss: `.quickpage-render h1 { color: #c2410c; }
.quickpage-render .mt-6 { background: #fef3c7; border: 2px dashed #fbbf24; border-radius: 0.75rem; }
.quickpage-render a.inline-block { box-shadow: 0 8px 24px rgba(234, 88, 12, 0.35); }`,
  },

  notice: {
    templateId: "notice",
    layoutId: "minimal",
    title: "설 연휴 고객센터 운영 안내",
    subtitle: "휴무 기간 및 긴급 문의 방법을 확인해 주세요",
    bannerUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop",
    bannerHeight: "sm",
    bannerFocusY: 50,
    bannerFit: "cover",
    eventDate: "휴무: 2026.01.28 (수) ~ 01.30 (금)",
    eventLocation: "긴급 문의: 카카오톡 채널 @퀵브랜드",
    description:
      "설 연휴 기간 동안 고객센터 전화 상담이 중단됩니다. 이메일·채널 문의는 접수 순으로 답변드리며, 긴급한 서비스 장애는 24시간 모니터링팀이 대응합니다.",
    featuresTitle: "안내 사항",
    features: [
      "01.31 (토)부터 정상 운영 재개",
      "이메일 문의: support@example.com",
      "긴급 장애: 카카오톡 채널 우선 응대",
      "휴무 기간 주문·배송은 순차 처리",
    ],
    ctaText: "전체 공지 확인하기",
    ctaUrl: "#notice",
    accentColor: "#0284c7",
    backgroundColor: "#f0f9ff",
    textAlign: "left",
    titleSize: "md",
    ctaStyle: "outline",
    ctaSize: "md",
    sections: {
      showEventDate: true,
      showEventLocation: true,
      showDescription: true,
      showFeatures: true,
      showCta: true,
    },
    customCss: `.quickpage-render h1 { font-size: 1.5rem; }
.quickpage-render .mt-6 { background: #e0f2fe; border: 1px solid #7dd3fc; border-radius: 0.5rem; }
.quickpage-render ul li span { border-radius: 0.25rem; background: #0284c7 !important; }`,
  },

  opening: {
    templateId: "opening",
    layoutId: "hero-overlay",
    title: "강남 신규 플래그십 스토어 오픈",
    subtitle: "새로운 공간에서 만나는 특별한 첫 경험",
    bannerUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
    bannerHeight: "lg",
    bannerFocusY: 40,
    bannerFit: "cover",
    eventDate: "그랜드 오픈: 2026년 5월 1일 (목)",
    eventLocation: "서울 강남구 신사동 플래그십 스토어",
    description:
      "브랜드의 새로운 얼굴을 담은 플래그십 스토어가 문을 엽니다. 체험존, 포토존, 한정 굿즈 팝업까지—오픈 주간만의 특별한 프로그램을 준비했습니다.",
    featuresTitle: "오픈 기념 혜택",
    features: [
      "오픈 당일 선착순 100명 기념 굿즈",
      "전 품목 20% 오픈 할인 (5/1~5/7)",
      "인스타그램 인증 시 음료 무료",
      "한정판 콜라보 상품 현장 판매",
    ],
    ctaText: "오픈 알림 신청하기",
    ctaUrl: "#notify",
    accentColor: "#db2777",
    backgroundColor: "#1a0a14",
    textAlign: "center",
    titleSize: "lg",
    ctaStyle: "filled",
    ctaSize: "lg",
    sections: { ...defaultSections },
    customCss: `.quickpage-render h1 { background: linear-gradient(135deg, #f9a8d4, #db2777); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.quickpage-render .mt-6 { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); }
.quickpage-render a.inline-block { box-shadow: 0 0 24px rgba(219, 39, 119, 0.5); }`,
  },

  workshop: {
    templateId: "workshop",
    layoutId: "split",
    title: "1일 마케팅 실무 워크샵",
    subtitle: "현직 마케터가 알려주는 랜딩페이지 제작 노하우",
    bannerUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop",
    bannerHeight: "md",
    bannerFocusY: 50,
    bannerFit: "cover",
    eventDate: "2026년 3월 22일 (토) 10:00 ~ 17:00",
    eventLocation: "판교 스타트업 캠퍼스 2층 세미나실",
    description:
      "이론만으로 끝나지 않는 실전형 워크샵입니다. 오전에는 전환율 높은 랜딩 구조를 배우고, 오후에는 직접 페이지를 만들며 1:1 피드백을 받습니다.",
    featuresTitle: "커리큘럼",
    features: [
      "오전: 고전환 랜딩 구조 & 카피라이팅",
      "오후: 실습—나만의 이벤트 페이지 제작",
      "현직 마케터 1:1 피드백 세션",
      "실습 자료 PDF & 템플릿 제공",
    ],
    ctaText: "참가 신청하기",
    ctaUrl: "#apply",
    accentColor: "#059669",
    backgroundColor: "#f0fdf4",
    textAlign: "left",
    titleSize: "md",
    ctaStyle: "filled",
    ctaSize: "md",
    sections: { ...defaultSections },
    customCss: `.quickpage-render h1 { letter-spacing: -0.02em; }
.quickpage-render .mt-6 { border-left: 4px solid #059669; padding-left: 1rem; }
.quickpage-render ul li span { border-radius: 0.375rem; }`,
  },
};

export function getTemplatePreset(templateId: string): PageData {
  const preset = presets[templateId];
  if (preset) {
    return {
      ...preset,
      fontFamily: preset.fontFamily ?? "pretendard",
      sections: { ...preset.sections },
    };
  }
  return getTemplatePreset("event-classic");
}

export function getAllTemplatePresets(): Record<string, PageData> {
  return Object.fromEntries(
    Object.entries(presets).map(([id, data]) => [
      id,
      { ...data, fontFamily: data.fontFamily ?? "pretendard", sections: { ...data.sections } },
    ]),
  );
}
