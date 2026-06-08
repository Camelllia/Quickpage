export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadText(content: string, filename: string, mime = "text/plain;charset=utf-8"): void {
  downloadBlob(new Blob([content], { type: mime }), filename);
}

export function sanitizeFilename(title: string): string {
  const cleaned = title
    .trim()
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 50);
  return cleaned || "quickpage";
}
