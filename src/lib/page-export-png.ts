import { toPng } from "html-to-image";
import { generatePageHtml } from "./page-export-html";
import type { PageData } from "./types";

const EXPORT_WIDTH = 430;

const PLACEHOLDER_BANNER =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="860" height="480"><rect width="100%" height="100%" fill="#e5e7eb"/></svg>',
  );

function resolveUrl(url: string, origin: string): string {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("blob:")) return url;
  if (url.startsWith("/")) return `${origin}${url}`;
  return url;
}

async function blobUrlToDataUrl(blobUrl: string): Promise<string> {
  const res = await fetch(blobUrl);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function fetchAsDataUrl(url: string, origin: string): Promise<string> {
  if (url.startsWith("data:")) return url;
  if (url.startsWith("blob:")) return blobUrlToDataUrl(url);

  const absolute = resolveUrl(url, origin);
  const fetchUrl = absolute.startsWith(origin)
    ? absolute
    : `/api/proxy-image?url=${encodeURIComponent(absolute)}`;

  const res = await fetch(fetchUrl);
  if (!res.ok) throw new Error(`이미지 로드 실패: ${absolute}`);

  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function resolveBannerForExport(bannerUrl: string, origin: string): Promise<string> {
  if (!bannerUrl) return PLACEHOLDER_BANNER;
  try {
    const dataUrl = await fetchAsDataUrl(bannerUrl, origin);
    if (!dataUrl.startsWith("data:")) throw new Error("data URL 변환 실패");
    return dataUrl;
  } catch {
    return PLACEHOLDER_BANNER;
  }
}

function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll("img"));
  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }),
    ),
  ).then(() => undefined);
}

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

interface ExportMount {
  target: HTMLElement;
  cleanup: () => void;
}

async function mountExportElement(data: PageData, origin: string): Promise<ExportMount> {
  const bannerDataUrl = await resolveBannerForExport(data.bannerUrl, origin);
  const exportData: PageData = { ...data, bannerUrl: bannerDataUrl };

  const html = generatePageHtml(exportData, origin);
  const doc = new DOMParser().parseFromString(html, "text/html");

  const render = doc.querySelector(".quickpage-render");
  if (!render) throw new Error("렌더 영역을 만들 수 없습니다.");

  const styleEl = document.createElement("style");
  styleEl.setAttribute("data-quickpage-export-style", "");
  const baseCss = doc.querySelector("head style")?.textContent ?? "";
  styleEl.textContent = data.customCss ? `${baseCss}\n${data.customCss}` : baseCss;

  const clone = render.cloneNode(true) as HTMLElement;

  const host = document.createElement("div");
  host.setAttribute("data-quickpage-export-host", "");
  host.style.cssText = [
    "position:fixed",
    "top:0",
    "left:100vw",
    `width:${EXPORT_WIDTH}px`,
    "z-index:2147483647",
    "pointer-events:none",
  ].join(";");
  host.appendChild(styleEl);
  host.appendChild(clone);

  document.body.appendChild(host);

  await waitForImages(clone);
  await waitForPaint();

  return {
    target: clone,
    cleanup: () => host.remove(),
  };
}

export async function exportPageAsPng(data: PageData, origin: string): Promise<Blob> {
  const { target, cleanup } = await mountExportElement(data, origin);

  try {
    const width = target.offsetWidth || EXPORT_WIDTH;
    const height = target.scrollHeight || target.offsetHeight;

    if (height < 10) {
      throw new Error("캡처 영역 높이가 0입니다.");
    }

    const dataUrl = await toPng(target, {
      cacheBust: false,
      pixelRatio: 2,
      skipFonts: true,
      width,
      height,
      backgroundColor: data.backgroundColor ?? "#ffffff",
    });

    const res = await fetch(dataUrl);
    return await res.blob();
  } finally {
    cleanup();
  }
}
