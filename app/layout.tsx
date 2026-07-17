import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Footer } from "@/components/footer";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { AdRails, AdBottomMobile } from "@/components/AdRails";
import { SITE, siteUrl } from "@/lib/config/site";
import { ADS_ENABLED, ADSENSE_CLIENT } from "@/lib/config/flags";

const SITE_URL = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "문해력 모의고사 · 오늘의 시험지",
    template: "%s · 문해력 모의고사",
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "문해력 모의고사 · 오늘의 시험지",
    description: "매일 10문항, 내 문해력은 몇 등급? 친구랑 같은 시험지로 비교해요.",
    // 홈/기본 공유용 OG(api/og 의 BrandCard, 1200x630). 결과 페이지는 자체 og:image 로 덮어씀.
    images: ["/api/og?fmt=home"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Nanum+Myeongjo:wght@400;700;800&display=swap"
        />
      </head>
      <body className="min-h-screen bg-cream text-ink antialiased">
        <AnalyticsProvider />
        <AdRails />
        {ADS_ENABLED && (
          <Script
            id="adsbygoogle-init"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          />
        )}
        {children}
        {/* 모바일 하단 배너 — 응시("/quiz") 제외 전 페이지. 단위 ID 있을 때만 노출 */}
        <AdBottomMobile className="mx-auto flex max-w-md justify-center px-5 pb-4" />
        <Footer
          logoSrc={null}
          links={[
            { label: "가이드", href: "/guide/문해력-테스트" },
            { label: "소개", href: "/about" },
            { label: "개인정보처리방침", href: "/privacy" },
          ]}
          note="본 테스트는 재미·참고용 엔터테인먼트이며 공인 시험이 아닙니다 · 개인정보를 저장하지 않아요"
        />
      </body>
    </html>
  );
}
