"use client";

import { useEffect } from "react";
import { getFontById } from "@/lib/fonts";
import type { FontFamilyId } from "@/lib/types";

const LINK_ID = "quickpage-page-font";

export default function PageFontLoader({ fontId }: { fontId: FontFamilyId }) {
  const font = getFontById(fontId);

  useEffect(() => {
    if (!font.href) {
      const existing = document.getElementById(LINK_ID);
      if (existing) existing.remove();
      return;
    }

    let link = document.getElementById(LINK_ID) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = LINK_ID;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = font.href;
  }, [font.href]);

  return null;
}
