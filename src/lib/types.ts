export type BannerHeight = "sm" | "md" | "lg";
export type BannerFit = "cover" | "contain";
export type TextAlign = "left" | "center";
export type TitleSize = "sm" | "md" | "lg";
export type CtaStyle = "filled" | "outline";
export type CtaSize = "sm" | "md" | "lg";

export type LayoutId =
  | "classic"
  | "hero-overlay"
  | "split"
  | "minimal"
  | "magazine"
  | "card";

export type FontFamilyId =
  | "pretendard"
  | "noto-sans"
  | "noto-serif"
  | "nanum-gothic"
  | "gowun-batang"
  | "black-han-sans"
  | "jua";

export interface PageSections {
  showEventDate: boolean;
  showEventLocation: boolean;
  showDescription: boolean;
  showFeatures: boolean;
  showCta: boolean;
}

export interface PageData {
  templateId: string;
  layoutId: LayoutId;
  title: string;
  subtitle: string;
  bannerUrl: string;
  bannerHeight: BannerHeight;
  bannerFocusY: number;
  bannerFit: BannerFit;
  eventDate: string;
  eventLocation: string;
  description: string;
  featuresTitle: string;
  features: string[];
  ctaText: string;
  ctaUrl: string;
  accentColor: string;
  backgroundColor: string;
  textAlign: TextAlign;
  fontFamily: FontFamilyId;
  titleSize: TitleSize;
  ctaStyle: CtaStyle;
  ctaSize: CtaSize;
  sections: PageSections;
  customCss: string;
}

export type WorkspaceRole = "owner" | "admin" | "member";

export interface Workspace {
  id: string;
  name: string;
  ownerId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string | null;
  role: WorkspaceRole;
  createdAt: string;
}

export interface PageFolder {
  id: string;
  userId: string | null;
  workspaceId: string | null;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedPageRecord {
  id: string;
  userId: string | null;
  workspaceId: string | null;
  name: string;
  folderId: string | null;
  starred: boolean;
  data: PageData;
  published: boolean;
  expiresAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PageMetaUpdate {
  name?: string;
  folderId?: string | null;
  starred?: boolean;
  published?: boolean;
  expiresAt?: string | null;
}

export type PagePublicStatus = "available" | "not_found" | "unpublished" | "expired";

export interface PageTrackingEvent {
  id: string;
  pageId: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrer: string | null;
  createdAt: string;
}

export interface PageTrackingEventInput {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  referrer?: string | null;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  gradient: string;
  tags: string[];
  popular?: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}
