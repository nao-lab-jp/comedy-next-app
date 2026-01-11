import React from 'react';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'ご利用ガイド・初めての方へ | 東京お笑いライブ検索',
  description: '東京お笑いライブ検索の使い方、各プレイガイド（FANY, TIGET等）の特徴、ライブ情報の見方について解説します。',
};

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 md:py-12 px-4">
      <article className="max-w-3xl mx-auto bg-white p-6 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        
        {/* ヘッダー部分 */}
        <div className="border-b border-gray-100 pb-8 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">ご利用ガイド・初めての方へ</h1>
          <p className="text-gray-600 leading-relaxed">
            「東京お笑いライブ検索」をご利用いただきありがとうございます。<br />
            当サイトは、東京で開催されるお笑いライブの情報を、網羅的に横断検索できるサービスです。
            推しの芸人さんの出演情報探しや、今日ふらっと行けるライブ探しにご活用ください。
          </p>
        </div>

        {/* 1. サイトの使い方 */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-6 flex items-center">
            <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">1</span>
            このサイトでできること
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold text-lg text-gray-800 mb-2">🔍 推しを逃さない「キーワード検索」</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                トップページの検索窓に、好きな芸人の名前（コンビ名・個人名）や、ライブ名を入力してください。
                FANYチケット、TIGET、LivePocket、K-PROなど、主要なサイトをまとめて検索し、出演予定を一覧で表示します。
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-bold text-lg text-gray-800 mb-2">📅 予定が空いたら「日付検索」</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                「今日の夜、急に暇になった」「週末にデートでお笑いを見たい」
                そんな時は日付を指定して検索。その日に開催される、まだチケットが購入可能なライブを見つけることができます。
              </p>
            </div>
          </div>
        </section>

        {/* 2. チケットサイトの違い */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-6 flex items-center">
            <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">2</span>
            チケットサイトごとの特徴
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            お笑いライブは主催者や劇場によって、使われるチケットサイトが異なります。当サイトでは主に以下のサイトの情報を掲載しています。
          </p>
          
          <div className="grid gap-4">
            {/* FANY */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-bold text-red-500 mb-1 text-lg">FANYチケット</h3>
              <p className="text-xs text-gray-500 mb-2">
                <span className="font-bold">主な会場：</span>ルミネtheよしもと、ヨシモト∞ホール、神保町よしもと漫才劇場など
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                吉本興業の公式チケットサイトです。吉本所属芸人のライブはほぼ全てここで販売されます。事前の会員登録（FANY ID）が必要です。
              </p>
            </div>

            {/* TIGET */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-bold text-teal-600 mb-1 text-lg">TIGET（チゲット）</h3>
              <p className="text-xs text-gray-500 mb-2">
                <span className="font-bold">主な会場：</span>新宿バッシュ、バティオス、下北沢各小劇場など
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                若手芸人の主催ライブや、事務所の垣根を超えたライブでよく使われます。
                特徴は「当日払い（取り置き）」が多いこと。ネットで予約だけして、代金は当日の受付で支払うパターンが主流です。
              </p>
            </div>

            {/* LivePocket */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-bold text-purple-600 mb-1 text-lg">LivePocket（ライブポケット）</h3>
              <p className="text-xs text-gray-500 mb-2">
                <span className="font-bold">主な会場：</span>西新宿ナルゲキ、座・高円寺など
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                K-PRO主催ライブや、人力舎、マセキ芸能社などの事務所ライブで多く利用されます。QRコードチケットが発行されるため、入場がスムーズです。
              </p>
            </div>
          </div>
        </section>

        {/* 3. 用語・マナー */}
        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-6 flex items-center">
            <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">3</span>
            知っておきたい用語・マナー
          </h2>
          <dl className="space-y-6 text-sm">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 border-b border-gray-100 pb-6">
              <dt className="font-bold text-gray-900 min-w-[120px] text-base">整理番号</dt>
              <dd className="text-gray-600 leading-relaxed">
                お笑いライブは「指定席」の場合と、「自由席」の場合があります。
                自由席の場合、チケットに書かれた整理番号順に入場し、好きな席に座ります。開場時間に遅れると番号が無効になることがあるので注意しましょう。
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 border-b border-gray-100 pb-6">
              <dt className="font-bold text-gray-900 min-w-[120px] text-base">取り置き</dt>
              <dd className="text-gray-600 leading-relaxed">
                チケット代を事前に支払わず、予約者の名前をリストに載せておくシステムです。
                当日の受付で「取り置きの〇〇です」と伝えて、その場でお金を払います。キャンセルもしやすい反面、無断キャンセルはご法度です。
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
              <dt className="font-bold text-gray-900 min-w-[120px] text-base">ワンドリンク制</dt>
              <dd className="text-gray-600 leading-relaxed">
                ライブハウスで開催される場合、チケット代とは別に、入場時にドリンク代（500円〜600円程度）が必要になることがあります。小銭を用意しておくとスムーズです。
              </dd>
            </div>
          </dl>
        </section>

        {/* 免責事項 */}
        <section className="bg-gray-100 p-6 rounded-lg mt-12">
          <h3 className="font-bold text-gray-700 mb-3 text-sm">ご注意・免責事項</h3>
          <ul className="list-disc pl-5 space-y-2 text-xs text-gray-600 leading-relaxed">
            <li>当サイトは非公式のファンサイトであり、各芸能事務所およびチケット販売サイトとは一切関係ありません。</li>
            <li>ライブ情報は、情報の正確性を完全に保証するものではありません。</li>
            <li>チケットの購入、公演の中止・延期に関する最新情報は、必ずリンク先の公式販売ページをご確認ください。</li>
          </ul>
        </section>

        <div className="mt-12 text-center">
          <a href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition shadow-md">
            トップページに戻って検索する
          </a>
        </div>

      </article>
    </main>
  );
}