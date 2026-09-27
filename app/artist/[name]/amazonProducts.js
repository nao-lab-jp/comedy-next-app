// 芸人ページに出すAmazonの商品。2026-09-27にAmazon.co.jpで実在を確認したもの。
//
// 対象は検索クリック数の上位30組(全クリックの80%)。商品が見つからなかった芸人は
// 載せない。関連の薄い商品を並べるとページが薄くなり、SEO上むしろ逆効果になるため。
//
// 並べる順は紹介料率の高い順: Kindle(8%) > 本(3%) > DVD(2%) > ビデオ(レンタル・購入 10%)。
// ビデオは料率こそ高いが、Prime会員の特典視聴だと0%になるうえ、作品ページが
// 「バナー」的で具体性に欠けるため最後に置いている。1組あたり最大2件。
//
// DBの artist_profiles.afi_link は使わなくなった。以前そこに入っていた4件のうち
// 2件(イチゴ・トット)は別の芸人の作品を指しており、霜降り明星の1件も本人の
// 単独作品ではなかったため、ここで作品名まで確認したものに置き換えている。

export const ASSOCIATE_TAG = 'naoppu05180a-22';

export function amazonUrl(asin) {
  return `https://www.amazon.co.jp/dp/${asin}?tag=${ASSOCIATE_TAG}`;
}

export const AMAZON_PRODUCTS = {
  '霜降り明星': [
    { asin: 'B07WV6TZ3B', kind: 'Kindle', title: 'Quick Japan Vol.145（霜降り明星 特集）' },
    { asin: '4778319672', kind: '本', title: '芸人雑誌 volume13【表紙：霜降り明星 せいや】' },
  ],
  'スクールゾーン': [
    { asin: 'B0BYS65522', kind: 'Kindle', title: 'スクールゾーンはしもの 韓流あるある100' },
  ],
  'ジョイマン': [
    { asin: 'B0BJPNPZQR', kind: 'Kindle', title: 'ここにいるよ ジョイマン・高木のツイート日記 2010-2020' },
    { asin: '4891883561', kind: '本', title: 'ななな' },
  ],
  '博多華丸・大吉': [
    { asin: '4896372700', kind: '本', title: '博多華丸・大吉式ハカタ語会話' },
    { asin: 'B0B8NP9FFB', kind: 'ビデオ', title: '華丸・大吉のなんしようと？' },
  ],
  '横澤夏子': [
    { asin: 'B07MD8PNTS', kind: 'Kindle', title: '追い込み婚のすべて' },
    { asin: '4865936793', kind: '本', title: 'ドタバタ子育て大作戦 三姉妹のれんらくちょう' },
  ],
  '次長課長': [
    { asin: '4047279781', kind: '本', title: '次長課長・井上聡のごきげんよう、赤のゲームです' },
    { asin: '484701975X', kind: '本', title: '鬼嫁合衆国（河本準一）' },
  ],
  'エバース': [
    { asin: 'B0DXDG2SGR', kind: 'Kindle', title: '芸人雑誌 volume14【表紙：エバース／ナイチンゲールダンス】' },
    { asin: 'B0GMQDBP1W', kind: 'ビデオ', title: 'エバースの即漫' },
  ],
  '麒麟': [
    { asin: '4800297702', kind: '本', title: '#麒麟川島のタグ大喜利' },
  ],
  'エルフ': [
    { asin: '4847072650', kind: '本', title: 'エルフ・荒川の日めくり まいにち、GAL！' },
  ],
  'FUJIWARA': [
    { asin: 'B000LE1KWW', kind: 'DVD', title: 'FUJIWARA（単独ライブDVD）' },
  ],
  'めぞん': [
    { asin: 'B0H33B8MFC', kind: 'ビデオ', title: 'めぞんボックス〜1人1つスキルを付与されて行うライブ〜' },
  ],
  'ダイタク': [
    { asin: 'B0GW32BVNP', kind: 'ビデオ', title: 'ダイタク大「もうええて！」' },
  ],
  // マーケットプレイス出品のため在庫が切れやすい。切れていたら外すこと。
  'くまだまさし': [
    { asin: 'B0GQBV5N3V', kind: '文房具', title: 'くまだまさし自由帳' },
  ],
};

export function productsFor(artistName) {
  return AMAZON_PRODUCTS[artistName] || [];
}
