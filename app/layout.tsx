import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// ▼ TypeScript用に型定義 (: Metadata) を追加しました
export const metadata: Metadata = {
  // サイトのドメイン（これを指定しておくと画像のURLなどが短く書けます）
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
    // ▼ 追加: 画像設定（publicフォルダのogp.pngを参照します）
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
    // ▼ 追加: Twitter用の画像指定
    images: ["/ogp.png"],
  },

  // ▼ Google Search Consoleの認証コード
  verification: {
    google: 'GwfHT8pYbX-GFlZC8KSmLWSvs1jn70agoXJZwnd82EY',
  },
};

// ▼ ここもTypeScript用に型定義を追加しました
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
    </html>
  );
}