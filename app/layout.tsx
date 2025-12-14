import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'; // ← GA用
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// ▼ ここがSEO設定の本体です
export const metadata: Metadata = {
  // 1. ドメインのルート設定（OGP画像などを正しく表示するために必須）
  metadataBase: new URL("https://owarai-live.com"),

  // 2. タイトル設定
  // default: トップページなどで使われるタイトル
  // template: "%s | ..." の %s 部分に、各ページ（芸人ページ等）のタイトルが入ります
  title: {
    default: "東京お笑いライブ検索 | 推しの芸人の予定を即チェック",
    template: "%s | 東京お笑いライブ検索",
  },

  // 3. 説明文（Google検索結果の下に出る文章）
  description: "東京で開催されるお笑いライブの情報を毎日自動更新。好きな芸人の出演ライブを一発検索できるWebサービスです。",

  // 4. 検索ロボットへの指示（検索結果に出す設定）
  robots: {
    index: true,
    follow: true,
  },

  // 5. SNSでシェアされた時の設定（Open Graph）
  openGraph: {
    title: "東京お笑いライブ検索",
    description: "東京のライブ情報を毎日更新中！推しの芸人の予定を今すぐチェック。",
    url: "https://owarai-live.com",
    siteName: "東京お笑いライブ検索",
    locale: "ja_JP",
    type: "website",
  },

  // 6. X (Twitter) カードの設定
  twitter: {
    card: "summary_large_image", // 大きな画像で表示させる設定
    title: "東京お笑いライブ検索",
    description: "推しの芸人のライブ予定を今すぐチェック！",
  },
};

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
      {/* ▼ Google Analyticsの設定（IDはVercelの環境変数から読み込み） */}
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
    </html>
  );
}