import type { Metadata, Viewport } from "next";
import { BRAND_NAME } from "@/lib/brand";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: `${BRAND_NAME} | 10분 안에 배포하는 이벤트 페이지`,
  description:
    "개발자 없이, 디자인 툴 없이. 배너와 문구만 입력하면 반응형 이벤트 랜딩 페이지가 생성되는 초간편 빌더.",
  keywords: ["랜딩페이지", "이벤트페이지", "템플릿", "마케팅", "Quickpage"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
