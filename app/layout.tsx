import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thumb-fit.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Thumb Fit - 썸네일 메이커 | Thumbnail Maker",
    template: "%s | Thumb Fit",
  },
  description:
    "유튜브, 인스타그램, 틱톡, 블로그용 썸네일을 쉽고 빠르게 만드세요. Create perfect thumbnails for YouTube, Instagram, TikTok, and blogs with automatic resizing and blur background.",
  keywords: [
    // 한국어 키워드
    "썸네일 만들기",
    "썸네일 메이커",
    "유튜브 썸네일",
    "인스타그램 썸네일",
    "블로그 썸네일",
    "썸네일 리사이즈",
    "이미지 비율 변환",
    "블러 배경",
    "텍스트 오버레이",
    "무료 썸네일",
    // English keywords
    "thumbnail maker",
    "thumbnail generator",
    "youtube thumbnail",
    "instagram thumbnail",
    "tiktok thumbnail",
    "image resize",
    "blur background",
    "aspect ratio converter",
    "free thumbnail tool",
    "social media thumbnail",
  ],
  authors: [{ name: "Thumb Fit" }],
  creator: "Thumb Fit",
  publisher: "Thumb Fit",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    url: siteUrl,
    siteName: "Thumb Fit",
    title: "Thumb Fit - 썸네일 메이커 | Thumbnail Maker",
    description:
      "유튜브, 인스타그램, 틱톡용 썸네일을 쉽고 빠르게 만드세요. Create perfect thumbnails for YouTube, Instagram, and TikTok.",
    images: [
      {
        url: "/thumb-fit.png",
        width: 1200,
        height: 630,
        alt: "Thumb Fit - Thumbnail Maker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thumb Fit - 썸네일 메이커 | Thumbnail Maker",
    description:
      "유튜브, 인스타그램, 틱톡용 썸네일을 쉽고 빠르게 만드세요. Create perfect thumbnails easily.",
    images: ["/thumb-fit.png"],
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "ko-KR": siteUrl,
      "en-US": siteUrl,
    },
  },
  category: "technology",
  verification: {
    google: "me6sjKqk3yFixmZfkvxbzJ6PQv7ZtUpQHgRYc5_SOYM",
  },
};

// JSON-LD 구조화 데이터
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Thumb Fit",
  alternateName: ["썸네일 메이커", "Thumbnail Maker"],
  description:
    "유튜브, 인스타그램, 틱톡, 블로그용 썸네일을 쉽고 빠르게 만드세요. Create perfect thumbnails for YouTube, Instagram, TikTok, and blogs.",
  url: siteUrl,
  applicationCategory: "DesignApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "YouTube thumbnail creation",
    "Instagram thumbnail creation",
    "TikTok thumbnail creation",
    "Auto resize with blur background",
    "Text overlay",
    "Multiple aspect ratios (16:9, 9:16, 1:1)",
  ],
  inLanguage: ["ko", "en"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
