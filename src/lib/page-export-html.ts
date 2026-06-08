import { defaultSections } from "./defaults";
import { getFontById, getFontStylesheetLink } from "./fonts";
import { normalizePageData } from "./normalize-page-data";
import { isDarkBackground } from "./style";
import type { PageData } from "./types";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function resolveUrl(url: string, origin?: string): string {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  if (url.startsWith("/") && origin) return `${origin}${url}`;
  return url;
}

const TITLE_SIZES = { sm: "1.875rem", md: "2.25rem", lg: "3rem" };
const BANNER_HEIGHTS = { sm: "14rem", md: "24rem", lg: "28rem" };
const CTA_PADDING = { sm: "0.625rem 1.5rem", md: "1rem 2.5rem", lg: "1.25rem 3rem" };
const CTA_FONT = { sm: "0.875rem", md: "1.125rem", lg: "1.25rem" };

export function generatePageHtml(data: PageData, origin?: string): string {
  const page = normalizePageData(data);
  const font = getFontById(page.fontFamily);
  const fontLink = getFontStylesheetLink(page.fontFamily);
  const sections = page.sections ?? defaultSections;
  const bg = data.backgroundColor ?? "#ffffff";
  const dark = isDarkBackground(bg);
  const textColor = dark ? "#f3f4f6" : "#111827";
  const subtextColor = dark ? "#d1d5db" : "#4b5563";
  const bodyColor = dark ? "#d1d5db" : "#4b5563";
  const cardBg = dark ? "rgba(255,255,255,0.05)" : "#f9fafb";
  const cardBorder = dark ? "rgba(255,255,255,0.1)" : "#f3f4f6";
  const align = data.textAlign === "center" ? "center" : "left";
  const bannerUrl = data.bannerUrl ? resolveUrl(data.bannerUrl, origin) : "";
  const focusY = data.bannerFocusY ?? 50;
  const fit = data.bannerFit ?? "cover";
  const height = data.bannerHeight ?? "md";
  const titleSize = TITLE_SIZES[data.titleSize ?? "md"];
  const ctaPadding = CTA_PADDING[data.ctaSize ?? "md"];
  const ctaFont = CTA_FONT[data.ctaSize ?? "md"];

  const ctaStyle =
    data.ctaStyle === "outline"
      ? `border:2px solid ${data.accentColor};color:${data.accentColor};background:transparent;`
      : `background:${data.accentColor};color:#fff;border:none;`;

  const dateBlock =
    sections.showEventDate && data.eventDate
      ? `<div style="display:flex;align-items:center;gap:0.5rem;font-size:0.875rem;color:${bodyColor}">
          <span>📅</span>${escapeHtml(data.eventDate)}
        </div>`
      : "";

  const locationBlock =
    sections.showEventLocation && data.eventLocation
      ? `<div style="display:flex;align-items:center;gap:0.5rem;font-size:0.875rem;color:${bodyColor}">
          <span>📍</span>${escapeHtml(data.eventLocation)}
        </div>`
      : "";

  const metaBlock =
    dateBlock || locationBlock
      ? `<div style="margin-top:1.5rem;display:flex;flex-direction:column;gap:0.75rem;padding:1rem;border-radius:0.75rem;border:1px solid ${cardBorder};background:${cardBg};${align === "center" ? "align-items:center;" : ""}">
          ${dateBlock}${locationBlock}
        </div>`
      : "";

  const descriptionBlock =
    sections.showDescription && data.description
      ? `<p style="margin-top:2rem;line-height:1.75;color:${bodyColor};">${escapeHtml(data.description)}</p>`
      : "";

  const features = data.features.filter(Boolean);
  const featuresBlock =
    sections.showFeatures && features.length > 0
      ? `<div style="margin-top:2rem;${align === "center" ? "text-align:center;" : ""}">
          ${data.featuresTitle ? `<h2 style="margin-bottom:1rem;font-size:1.125rem;font-weight:700;color:${textColor};">${escapeHtml(data.featuresTitle)}</h2>` : ""}
          <ul style="list-style:none;padding:0;margin:0;${align === "center" ? "display:inline-block;text-align:left;" : ""}">
            ${features
              .map(
                (f) =>
                  `<li style="display:flex;align-items:flex-start;gap:0.75rem;margin-bottom:0.75rem;color:${dark ? "#e5e7eb" : "#374151"};">
                    <span style="margin-top:0.125rem;display:flex;height:1.25rem;width:1.25rem;flex-shrink:0;align-items:center;justify-content:center;border-radius:9999px;font-size:0.75rem;color:#fff;background:${data.accentColor};">✓</span>
                    ${escapeHtml(f)}
                  </li>`,
              )
              .join("")}
          </ul>
        </div>`
      : "";

  const ctaBlock =
    sections.showCta && data.ctaText
      ? `<div style="margin-top:2.5rem;text-align:${align};">
          <a href="${escapeHtml(data.ctaUrl || "#")}" style="display:inline-block;border-radius:9999px;font-weight:700;text-decoration:none;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);padding:${ctaPadding};font-size:${ctaFont};${ctaStyle}">
            ${escapeHtml(data.ctaText)}
          </a>
        </div>`
      : "";

  const customCss = data.customCss ? `<style>${data.customCss}</style>` : "";

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.subtitle)}" />
  <link rel="stylesheet" href="${fontLink}" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: ${font.family}; }
    .quickpage-render { min-height: 100vh; background: ${bg}; font-family: ${font.family}; }
  </style>
  ${customCss}
</head>
<body>
  <div class="quickpage-render" style="background:${bg};font-family:${font.family};width:430px;">
    <div style="position:relative;width:100%;height:${BANNER_HEIGHTS[height]};overflow:hidden;${fit === "contain" ? "background:#f3f4f6;" : "background:#e5e7eb;"}">
      ${bannerUrl ? `<img src="${escapeHtml(bannerUrl)}" alt="${escapeHtml(data.title)}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:${fit};object-position:center ${focusY}%;" />` : ""}
      <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(to top,rgba(0,0,0,0.5),transparent);"></div>
    </div>
    <div style="max-width:42rem;margin:0 auto;padding:2.5rem 1.5rem;text-align:${align};">
      <h1 style="font-weight:800;font-size:${titleSize};color:${textColor};">${escapeHtml(data.title)}</h1>
      ${data.subtitle ? `<p style="margin-top:0.75rem;font-size:1.125rem;color:${subtextColor};">${escapeHtml(data.subtitle)}</p>` : ""}
      ${metaBlock}
      ${descriptionBlock}
      ${featuresBlock}
      ${ctaBlock}
    </div>
  </div>
</body>
</html>`;
}
