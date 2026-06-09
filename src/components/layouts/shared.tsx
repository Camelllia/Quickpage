import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { BANNER_HEIGHT_CLASSES, getBannerImageStyle } from "@/lib/banner";
import { defaultSections } from "@/lib/defaults";
import { getFontById } from "@/lib/fonts";
import { CTA_SIZE_CLASSES, isDarkBackground, TITLE_SIZE_CLASSES } from "@/lib/style";
import type { FontFamilyId, PageData } from "@/lib/types";

/** 텍스트 영역 공통 — flex 안에서 줄바꿈이 깨지지 않도록 */
export const PROSE_BODY = "min-w-0 w-full break-keep [overflow-wrap:anywhere]";
export const PROSE_HEADING = "min-w-0 w-full break-keep leading-snug [overflow-wrap:anywhere]";
export const PROSE_INLINE = "min-w-0 flex-1 break-keep [overflow-wrap:anywhere]";

export function PageShell({
  children,
  bg,
  fontFamily = "pretendard",
  className = "",
}: {
  children: ReactNode;
  bg: string;
  fontFamily?: FontFamilyId;
  className?: string;
}) {
  const font = getFontById(fontFamily);

  return (
    <div
      className={`quickpage-render min-h-screen w-full overflow-x-hidden ${className}`}
      style={{ backgroundColor: bg, fontFamily: font.family }}
    >
      {children}
    </div>
  );
}

export function PageContent({
  children,
  className = "",
  align,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  align: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full px-4 py-8 sm:px-6 sm:py-10 ${
        wide ? "max-w-3xl" : "max-w-2xl"
      } ${PROSE_BODY} ${align} ${className}`}
    >
      {children}
    </div>
  );
}

export function usePageStyles(data: PageData) {
  const sections = data.sections ?? defaultSections;
  const bg = data.backgroundColor ?? "#ffffff";
  const dark = isDarkBackground(bg);
  const align = data.textAlign === "center" ? "text-center" : "text-left";
  const itemsAlign = data.textAlign === "center" ? "items-center" : "items-start";
  const ctaAlign = data.textAlign === "center" ? "text-center" : "text-left";

  const ctaClasses = [
    "inline-block max-w-full rounded-full font-bold shadow-lg transition-transform hover:scale-105",
    "whitespace-normal text-center break-keep [overflow-wrap:anywhere]",
    CTA_SIZE_CLASSES[data.ctaSize ?? "md"],
    data.ctaStyle === "outline" ? "border-2 bg-transparent" : "",
  ].join(" ");

  const ctaStyle =
    data.ctaStyle === "outline"
      ? { borderColor: data.accentColor, color: data.accentColor }
      : { backgroundColor: data.accentColor, color: "#ffffff" };

  return {
    sections,
    bg,
    dark,
    textColor: dark ? "text-gray-100" : "text-gray-900",
    subtextColor: dark ? "text-gray-300" : "text-gray-600",
    bodyColor: dark ? "text-gray-300" : "text-gray-600",
    align,
    itemsAlign,
    ctaAlign,
    ctaClasses,
    ctaStyle,
    height: data.bannerHeight ?? "md",
    focusY: data.bannerFocusY ?? 50,
    fit: data.bannerFit ?? "cover",
    imageStyle: getBannerImageStyle(data.bannerFocusY ?? 50, data.bannerFit ?? "cover"),
    fontFamily: data.fontFamily ?? "pretendard",
  };
}

interface BannerProps {
  data: PageData;
  className?: string;
  overlayClass?: string;
  children?: ReactNode;
}

export function PageBanner({ data, className = "", overlayClass, children }: BannerProps) {
  const height = data.bannerHeight ?? "md";
  const focusY = data.bannerFocusY ?? 50;
  const fit = data.bannerFit ?? "cover";
  const imageStyle = getBannerImageStyle(focusY, fit);

  return (
    <div
      className={`relative w-full ${BANNER_HEIGHT_CLASSES[height]} ${fit === "contain" ? "bg-gray-100" : ""} ${className}`}
    >
      {data.bannerUrl.startsWith("blob:") ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.bannerUrl}
          alt={data.title}
          className="absolute inset-0 h-full w-full"
          style={imageStyle}
        />
      ) : (
        <Image
          src={data.bannerUrl}
          alt={data.title}
          fill
          className={fit === "cover" ? "object-cover" : "object-contain"}
          style={{ objectPosition: `center ${focusY}%` }}
          priority
          sizes="100vw"
          unoptimized={data.bannerUrl.startsWith("/uploads/")}
        />
      )}
      <div
        className={
          overlayClass ?? "absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
        }
      />
      {children}
    </div>
  );
}

export function PageTitle({
  data,
  styles,
  className = "",
  light = false,
}: {
  data: PageData;
  styles: ReturnType<typeof usePageStyles>;
  className?: string;
  light?: boolean;
}) {
  const titleColor = light ? "text-white" : styles.textColor;
  const subColor = light ? "text-white/90" : styles.subtextColor;

  return (
    <div className={`${PROSE_BODY} ${className}`}>
      <h1 className={`font-extrabold ${PROSE_HEADING} ${TITLE_SIZE_CLASSES[data.titleSize ?? "md"]} ${titleColor}`}>
        {data.title}
      </h1>
      {data.subtitle && (
        <p className={`mt-3 text-base sm:text-lg ${PROSE_BODY} ${subColor}`}>{data.subtitle}</p>
      )}
    </div>
  );
}

export function PageMeta({
  data,
  styles,
  className = "",
}: {
  data: PageData;
  styles: ReturnType<typeof usePageStyles>;
  className?: string;
}) {
  const { sections, dark, bodyColor } = styles;
  if (!sections.showEventDate && !sections.showEventLocation) return null;

  return (
    <div
      className={`flex w-full min-w-0 flex-col gap-3 rounded-xl border p-4 ${
        dark ? "border-white/10 bg-white/5" : "border-gray-100 bg-gray-50"
      } ${data.textAlign === "center" ? "items-center text-center" : ""} ${className}`}
    >
      {sections.showEventDate && (
        <div className={`flex w-full min-w-0 items-start gap-2 text-sm ${bodyColor} ${data.textAlign === "center" ? "justify-center" : ""}`}>
          <svg className="mt-0.5 h-5 w-5 shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className={PROSE_INLINE}>{data.eventDate}</span>
        </div>
      )}
      {sections.showEventLocation && (
        <div className={`flex w-full min-w-0 items-start gap-2 text-sm ${bodyColor} ${data.textAlign === "center" ? "justify-center" : ""}`}>
          <svg className="mt-0.5 h-5 w-5 shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className={PROSE_INLINE}>{data.eventLocation}</span>
        </div>
      )}
    </div>
  );
}

export function PageDescription({
  data,
  styles,
  className = "",
}: {
  data: PageData;
  styles: ReturnType<typeof usePageStyles>;
  className?: string;
}) {
  if (!styles.sections.showDescription || !data.description) return null;
  return (
    <p className={`${PROSE_BODY} leading-relaxed ${styles.bodyColor} ${className}`}>{data.description}</p>
  );
}

export function PageFeatures({
  data,
  styles,
  className = "",
}: {
  data: PageData;
  styles: ReturnType<typeof usePageStyles>;
  className?: string;
}) {
  const features = data.features.filter(Boolean);
  if (!styles.sections.showFeatures || features.length === 0) return null;

  return (
    <div className={`flex w-full min-w-0 flex-col ${styles.itemsAlign} ${className}`}>
      {data.featuresTitle && (
        <h2 className={`mb-4 text-lg font-bold ${PROSE_HEADING} ${styles.textColor}`}>{data.featuresTitle}</h2>
      )}
      <ul className={`w-full min-w-0 space-y-3 ${data.textAlign === "center" ? "max-w-full" : ""}`}>
        {features.map((feature) => (
          <li key={feature} className={`flex w-full min-w-0 items-start gap-3 ${styles.dark ? "text-gray-200" : "text-gray-700"}`}>
            <span
              className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs text-white"
              style={{ backgroundColor: data.accentColor }}
            >
              ✓
            </span>
            <span className={PROSE_INLINE}>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PageCta({
  data,
  styles,
  className = "",
}: {
  data: PageData;
  styles: ReturnType<typeof usePageStyles>;
  className?: string;
}) {
  if (!styles.sections.showCta) return null;
  return (
    <div className={`${styles.ctaAlign} ${className}`}>
      <a href={data.ctaUrl} className={styles.ctaClasses} style={styles.ctaStyle}>
        {data.ctaText}
      </a>
    </div>
  );
}

export function PageWatermark({
  dark,
  show,
}: {
  dark: boolean;
  show: boolean;
}) {
  if (!show) return null;
  return (
    <div className={`border-t py-4 text-center ${dark ? "border-white/10" : "border-gray-100 bg-gray-50"}`}>
      <Link href="/" className="text-sm text-gray-400 hover:text-[#ff4d6d]">
        Made by Quickpage →
      </Link>
    </div>
  );
}

export function PageCustomCss({ css }: { css?: string }) {
  if (!css) return null;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
