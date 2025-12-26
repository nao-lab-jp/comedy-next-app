import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from "next/script";
import Footer from "./components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // ★重要1: サイトのドメイン（ベースURL）
  metadataBase: new URL("https://owarai-live.com"),

  title: {
    default: "東京お笑いライブ検索 | 推しの芸人の予定を即チェック",
    template: "%s | 東京お笑いライブ検索",
  },

  description: "東京で開催されるお笑いライブの情報を毎日自動更新。好きな芸人の出演ライブを一発検索できるWebサービスです。",

  // ★重要2: これが重複エラー対策の決定打です
  // 「パラメータ違いのURLは、すべて正規のURL（./）として扱ってください」という指示になります
  alternates: {
    canonical: './',
  },

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

  verification: {
    google: 'GwfHT8pYbX-GFlZC8KSmLWSvs1jn70agoXJZwnd82EY',
  },
  other: {
    "google-adsense-account": "ca-pub-8769762821267157",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {/* Next.jsのApp Routerでは、metadataの内容が自動的に<head>に展開されます。
        Scriptコンポーネントはbody内などに配置しても適切に動作するため、
        手動の<head>タグは削除し、構造をシンプルにしました。
      */}
      <body className={`${inter.className} flex flex-col min-h-screen`} suppressHydrationWarning>
        
        {/* AdSense審査用スクリプト */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8769762821267157"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <main className="flex-grow">
          {children}
        </main>

        <Footer />

        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}