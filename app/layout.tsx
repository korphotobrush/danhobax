import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "단호박어 번역기 — 싫은소리못하는사람의마음의소리",
  description: "쿠션어로 포장된 말을 진짜 하고 싶었던 말로 번역해드려요. 단호박어 번역기, 직장인 필수 앱.",
  keywords: "단호박어, 쿠션어 번역기, 직설적인 말투, 직장인, 말투 변환",
  openGraph: {
    title: "단호박어 번역기 — 싫은소리못하는사람의마음의소리",
    description: "쿠션어로 포장된 말을 진짜 하고 싶었던 말로 번역해드려요.",
    url: "https://danhobax.vercel.app",
    siteName: "단호박어 번역기",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="naver-site-verification" content="4b5e9b00e69c15078364abff73f8572b366cb8dd" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5549051245996079"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <script
          async
          type="text/javascript"
          src="https://t1.kakaocdn.net/kas/static/ba.min.js"
        />
      </body>
    </html>
  );
}
