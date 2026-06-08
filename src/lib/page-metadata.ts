import type { Metadata } from "next";
import type { PageData } from "./types";

const DEFAULT_OG_IMAGE = "/og-default.png";

export function getSiteUrl(fallback = "http://localhost:3000"): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) return env.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return fallback;
}

function toAbsoluteUrl(url: string, siteUrl: string): string {
  if (!url) return `${siteUrl}${DEFAULT_OG_IMAGE}`;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${siteUrl}${url}`;
  return `${siteUrl}/${url}`;
}

export function buildPageMetadata(
  page: PageData,
  pageId: string,
  siteUrl = getSiteUrl(),
): Metadata {
  const title = page.title;
  const description = page.subtitle || page.description?.slice(0, 160) || "퀵페이지로 만든 이벤트 페이지";
  const pageUrl = `${siteUrl}/p/${pageId}`;
  const imageUrl = toAbsoluteUrl(page.bannerUrl, siteUrl);

  return {
    title: `${title} | 퀵페이지`,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "퀵페이지",
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
