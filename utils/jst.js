// 日本時間の日付計算。
//
// events.json の live_date は「2026-10-16T19:30:00+00:00」の形だが、実際は
// 日本時間の 19:30 を UTC として保存している(スクレイパーが時刻をそのまま入れて
// いるため)。なので日付・時刻は文字列から切り出して扱い、Date のタイムゾーン
// 変換は通さない。サーバー(Vercel)は UTC で動いているので、今日の日付だけは
// +9時間して求める。

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export function jstToday() {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

export function addDays(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function dayOfWeek(dateStr) {
  return new Date(`${dateStr}T00:00:00Z`).getUTCDay();
}

// 「10月4日（土）」
export function formatMonthDay(dateStr) {
  const [, m, d] = dateStr.split('-').map(Number);
  return `${m}月${d}日（${WEEKDAYS[dayOfWeek(dateStr)]}）`;
}

// 今週末の土日。土曜なら今日と明日、日曜なら今日だけ、平日なら次の土日。
export function weekendDates(today = jstToday()) {
  const dow = dayOfWeek(today);
  if (dow === 6) return [today, addDays(today, 1)];
  if (dow === 0) return [today];
  return [addDays(today, 6 - dow), addDays(today, 7 - dow)];
}

export function eventDate(live) {
  return String(live.live_date || '').slice(0, 10);
}

// 開演時刻。時刻が取れていない公演(00:00で入っている)は空文字。
export function eventTime(live) {
  const time = String(live.live_date || '').slice(11, 16);
  return time && time !== '00:00' ? time : '';
}
