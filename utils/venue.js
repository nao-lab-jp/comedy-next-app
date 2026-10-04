import { normalizeVenue } from './area';

// 会場欄に入っているが会場名ではない値。
// TIGETは2026-09-30以前、一覧ページのエリア名「東京都」しか取れておらず、
// 過去分(約6,500件)の会場欄がすべて「東京都」になっている。
// 以降は詳細ページから実際の会場名を取っている。
const NON_VENUE_NAMES = new Set(['東京都']);

// FANYの主要4劇場はスクレイパー側で短縮名を入れている(既存データとの互換のため
// そちらは変えていない)。表示だけ正式名にする。
const VENUE_DISPLAY_NAMES = {
  'ルミネ': 'ルミネtheよしもと',
  '渋谷': '渋谷よしもと漫才劇場',
  '神保町': '神保町よしもと漫才劇場',
  '六本木': 'YOSHIMOTO ROPPONGI THEATER',
};

// 表示用の会場名。会場名として意味のない値なら空文字を返す。
// 全会場が東京都なので、末尾の「(東京都)」も外す。
export function displayVenue(venue) {
  if (!venue || NON_VENUE_NAMES.has(venue)) return '';
  const name = normalizeVenue(venue);
  return VENUE_DISPLAY_NAMES[name] || name;
}
