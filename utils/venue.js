// 会場欄に入っているが会場名ではない値。
// TIGETは2026-09-30以前、一覧ページのエリア名「東京都」しか取れておらず、
// 過去分(約6,500件)の会場欄がすべて「東京都」になっている。
// 以降は詳細ページから実際の会場名を取っている。
const NON_VENUE_NAMES = new Set(['東京都']);

// 表示用の会場名。会場名として意味のない値なら空文字を返す。
export function displayVenue(venue) {
  return venue && !NON_VENUE_NAMES.has(venue) ? venue : '';
}
