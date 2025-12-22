import React from 'react';

export const metadata = {
  title: '利用規約・免責事項 | 東京お笑いライブ検索',
  description: '東京お笑いライブ検索の利用規約および免責事項に関するページです。本サービスの利用条件を定義しています。',
};

export default function TermsOfService() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800 leading-loose">
      <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-lg">
        <h1 className="text-3xl font-bold mb-8 border-b-4 border-yellow-400 pb-2 inline-block">
          利用規約・免責事項
        </h1>

        <section className="mb-10">
          <p className="mb-4">
            この利用規約（以下「本規約」）は、東京お笑いライブ検索（以下「当サイト」）が提供するサービス（以下「本サービス」）の利用条件を定めるものです。利用者の皆様（以下「ユーザー」）には、本規約に従って本サービスをご利用いただきます。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="bg-yellow-400 w-2 h-6 mr-3"></span>
            第1条（免責事項：情報の正確性について）
          </h2>
          <div className="space-y-4">
            <p>
              1. 当サイトに掲載されている情報は、外部サイトから自動取得および手動登録されたものです。情報の正確性、最新性、完全性について、当サイトは細心の注意を払っておりますが、これを保証するものではありません。
            </p>
            <p>
              2. ライブの出演者変更、開演時間の変更、中止、延期等の詳細は、当サイトの反映にタイムラグが生じる場合があります。チケット購入や来場にあたっては、必ずリンク先の公式サイトまたはチケット販売サイトにて最終確認を行ってください。
            </p>
            <p>
              3. 当サイトの利用により生じた直接的・間接的な損害（チケットの誤購入、来場時のトラブル、情報の誤りによる不利益等）について、当サイト運営者は一切の責任を負いません。
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="bg-yellow-400 w-2 h-6 mr-3"></span>
            第2条（禁止事項）
          </h2>
          <p className="mb-4">ユーザーは、本サービスの利用にあたり、以下の行為を行ってはならないものとします。</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>当サイトのサーバーやネットワークシステムに過度な負荷をかける行為。</li>
            <li>当サイトの運営を妨害するおそれのある行為。</li>
            <li>当サイトのプログラムを解析、修正、改ざんする行為。</li>
            <li>当サイトに掲載されている情報を、事前の承諾なく複製、転載、商用利用する行為。</li>
            <li>その他、当サイトが不適切と判断する行為。</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="bg-yellow-400 w-2 h-6 mr-3"></span>
            第3条（知的財産権）
          </h2>
          <p>
            本サービスに関する知的財産権（文章、画像、デザイン、プログラム等）は、すべて当サイトまたは正当な権利を有する第三者に帰属します。ユーザーは、これらを無断で使用することはできません。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="bg-yellow-400 w-2 h-6 mr-3"></span>
            第4条（サービス内容の変更・中止）
          </h2>
          <p>
            当サイトは、ユーザーに事前に通知することなく、本サービスの内容を変更し、または提供を中止することができるものとします。これによってユーザーに生じた損害について、一切の責任を負いません。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="bg-yellow-400 w-2 h-6 mr-3"></span>
            第5条（準拠法・裁判管轄）
          </h2>
          <p>
            本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当サイト運営者の所在地を管轄する裁判所を専属的合意管轄とします。
          </p>
        </section>

        <hr className="my-10 border-gray-200" />

        <footer className="text-sm text-gray-500 space-y-1">
          <p>策定日：2025年12月22日</p>
          <p>運営者：東京お笑いライブ検索 (owarai-live.com)</p>
        </footer>
      </div>
    </main>
  );
}