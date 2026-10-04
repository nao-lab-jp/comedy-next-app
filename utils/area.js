// エリア別ページ(/area/{slug})と検索のエリア絞り込みで使う定義。
//
// 会場名からエリアを決める。データには住所が無いため、
//   1. 会場名に地名が含まれていればそれで判定(keywords)
//   2. 地名を含まない会場は、所在地を確認したうえで個別に指定(venues)
// の2段で判定する。所在地が確認できていない会場はどのエリアにも入れない
// (誤った地域に載せるより載せない方がよい)。
//
// 所在地の確認方法(2026-10-04):
//   TIGETの会場は詳細ページの住所(addressLocality)、それ以外はWeb検索。
// 区単位で確認し、検索されやすい地名でくくっている(例: 杉並区 → 高円寺・阿佐ヶ谷)。
//
// ここは全ページから読まれるので fs を使わないこと(SearchPanel はクライアント側)。

export const AREAS = [
  {
    slug: 'shinjuku',
    name: '新宿',
    keywords: ['新宿', '歌舞伎町', '四谷', '早稲田', '高田馬場'],
    venues: [
      'ルミネ', // FANYの短縮名。ルミネtheよしもと(ルミネ新宿2)
      'ルミネtheよしもと',
      'ハイジアV-1', // 新宿区(TIGET住所)
      '紀伊國屋ホール',
      'cafe COMADO', // 新宿区新宿6丁目(TIGET住所)
      '関交協ハーモニックホール', // 新宿区(TIGET住所)
      'フリースペース「無何有」', // 新宿区(TIGET住所)
    ],
  },
  {
    slug: 'shibuya',
    name: '渋谷・原宿',
    keywords: ['渋谷', 'SHIBUYA', '原宿', '代々木', '初台', '恵比寿'],
    venues: [
      'ユーロライブ', // 渋谷区(TIGET住所)
    ],
  },
  {
    slug: 'nakano',
    name: '中野',
    keywords: ['中野', 'なかの', '野方'],
    venues: [
      'Studio twl', // 中野区(TIGET住所)
      '彩演音ナナシ', // 中野区(TIGET住所)
      'TKJシアター', // 中野区(TIGET住所)
      'ニュー・サンナイ', // 中野区弥生町
      'ニュー･サンナイ',
      'テアトルBONBON', // 中野区中野3丁目
    ],
  },
  {
    slug: 'koenji',
    name: '高円寺・阿佐ヶ谷',
    keywords: ['高円寺', '阿佐ヶ谷', '阿佐谷', '荻窪', '杉並'],
    venues: [],
  },
  {
    slug: 'ikebukuro',
    name: '池袋・大塚',
    keywords: ['池袋', '大塚', '駒込', '要町'],
    venues: [
      '東京建物 Brillia HALL', // 豊島区立芸術文化劇場
      'あうるすぽっと', // 豊島区東池袋
      'Beach V', // 豊島区(TIGET住所)
      'びーちぶ', // 豊島区要町(TIGET住所)
      'スタジオフォー', // 豊島区(TIGET住所)
      'IKE･Biz としま産業振興プラザ', // 豊島区(TIGET住所)
      'コミュニティスペースminaikeZa', // 豊島区(TIGET住所)
    ],
  },
  {
    slug: 'shimokitazawa',
    name: '下北沢・世田谷',
    keywords: ['下北', '三軒茶屋', '世田谷'],
    venues: [
      'サンガイノリバティ', // 世田谷区(TIGET住所)
      'シアターミネルヴァ', // 世田谷区(TIGET住所)
      '小劇場B1', // 世田谷区北沢
    ],
  },
  {
    slug: 'jimbocho',
    name: '神保町・水道橋',
    keywords: ['神保町', '水道橋', '後楽園'],
    venues: [
      'IMM THEATER', // 文京区後楽(東京ドームシティ)
    ],
  },
  {
    slug: 'ginza',
    name: '銀座・有楽町',
    keywords: ['銀座', 'GINZA', '有楽町'],
    venues: [],
  },
  {
    slug: 'roppongi',
    name: '六本木・赤坂',
    keywords: ['六本木', 'ROPPONGI', '赤坂'],
    venues: [
      '草月ホール', // 港区赤坂
    ],
  },
];

// 「新宿ブリーカー(東京都)」の末尾の都道府県を外す
export function normalizeVenue(venue) {
  return String(venue || '').replace(/\s*[（(]東京都[）)]\s*$/, '').trim();
}

const VENUE_TO_AREA = new Map();
for (const area of AREAS) {
  for (const venue of area.venues) VENUE_TO_AREA.set(venue, area.slug);
}

// 会場名からエリアの slug を返す。判定できなければ null。
export function areaOf(venue) {
  const name = normalizeVenue(venue);
  if (!name) return null;

  const exact = VENUE_TO_AREA.get(name);
  if (exact) return exact;

  const lower = name.toLowerCase();
  for (const area of AREAS) {
    if (area.keywords.some(k => lower.includes(k.toLowerCase()))) return area.slug;
  }
  return null;
}

export function areaBySlug(slug) {
  return AREAS.find(a => a.slug === slug) || null;
}
