import React from 'react';

export const metadata = {
  title: 'プライバシーポリシー | 東京お笑いライブ検索',
  description: '東京お笑いライブ検索のプライバシーポリシー（個人情報の取り扱い）に関するページです。',
};

export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800 leading-loose">
      <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-lg">
        <h1 className="text-3xl font-bold mb-8 border-b-4 border-yellow-400 pb-2 inline-block">
          プライバシーポリシー
        </h1>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="bg-yellow-400 w-2 h-6 mr-3"></span>
            1. 広告の配信について
          </h2>
          <p className="mb-4">
            当サイトでは、第三者配信の広告サービス「Google アドセンス」を利用しています。
          </p>
          <p className="mb-4">
            広告配信事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、当サイトや他サイトへのアクセスに関する情報「Cookie」(氏名、住所、メールアドレス、電話番号は含まれません) を使用することがあります。
          </p>
          <p>
            Googleアドセンスに関して、このプロセスの詳細や情報が広告配信事業者に使用されないようにする方法については、
            <a 
              href="https://policies.google.com/technologies/ads?hl=ja" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline mx-1"
            >
              Googleポリシーと規約
            </a>
            をご覧ください。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="bg-yellow-400 w-2 h-6 mr-3"></span>
            2. アクセス解析ツールについて
          </h2>
          <p className="mb-4">
            当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。
          </p>
          <p>
            このトラフィックデータは匿名で収集されており、個人を特定するものではありません。この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="bg-yellow-400 w-2 h-6 mr-3"></span>
            3. 個人情報の利用目的
          </h2>
          <p className="mb-4">
            当サイトでは、お問い合わせやコメントの際に、氏名（ハンドルネーム含む）やメールアドレス等の個人情報を入力いただく場合がございます。
          </p>
          <p>
            取得した個人情報は、お問い合わせに対する回答や必要な情報を電子メールなどでご連絡する場合に利用するものであり、これらの目的以外では利用いたしません。また、個人情報保護法により認められる場合を除き、第三者に開示することはありません。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="bg-yellow-400 w-2 h-6 mr-3"></span>
            4. プライバシーポリシーの変更について
          </h2>
          <p>
            当サイトは、個人情報に関して適用される日本の法令を遵守するとともに、本ポリシーの内容を適宜見直しその改善に努めます。修正された最新のプライバシーポリシーは常に本ページにて開示されます。
          </p>
        </section>

        <hr className="my-10 border-gray-200" />

        <footer className="text-sm text-gray-500 space-y-1">
          <p>策定日：2025年12月22日</p>
          <p>運営者：東京お笑いライブ検索 (owarai-live.com)</p>
          <p>
            お問い合わせ先：
            <a href="/contact" className="text-blue-600 hover:underline">
              お問い合わせフォーム
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}