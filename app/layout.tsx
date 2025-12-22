import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from "next/script"; // ◀ AdSenseスクリプト用に追加
import Footer from "./components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://owarai-live.com"),

  title: {
    default: "東京お笑いライブ検索 | 推しの芸人の予定を即チェック",
    template: "%s | 東京お笑いライブ検索",
  },

  description: "東京で開催されるお笑いライブの情報を毎日自動更新。好きな芸人の出演ライブを一発検索できるWebサービスです。",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "東京お笑いライブ検索",
    description: "東京のライブ情報を毎日更新中！推しの芸人の予定を今すぐチェック。",
    url: "https://owarai-live.com",
    siteName: "東京お笑いライブ検索",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/ogp.png",
        width: 1200,
        height: 630,
        alt: "東京お笑いライブ検索",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "東京お笑いライブ検索",
    description: "推しの芸人のライブ予定を今すぐチェック！",
    images: ["/ogp.png"],
  },

  // ▼ 追加：Google Search Console と AdSense の認証設定
  verification: {
    google: 'GwfHT8pYbX-GFlZC8KSmLWSvs1jn70agoXJZwnd82EY',
  },
  other: {
    "google-adsense-account": "ca-pub-8769762821267157", // ◀ 認証用メタタグ
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* ▼ 追加：Google AdSense 審査用スクリプト */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8769762821267157"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      {/* ブラウザの拡張機能による干渉エラーを防ぐため suppressHydrationWarning を付与 */}
      <body className={`${inter.className} flex flex-col min-h-screen`} suppressHydrationWarning>
        
        {/* メインコンテンツ：flex-grow でフッターを最下部へ押し下げます */}
        <main className="flex-grow">
          {children}
        </main>

        {/* 全ページ共通のフッター */}
        <Footer />

        {/* GoogleAnalytics：環境変数が設定されている場合のみ読み込み */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}