// 今日・明日・今週末ページの共通部分(サーバーコンポーネント)。
import Link from 'next/link';
import { loadEvents } from '@/utils/events';
import { AREAS, areaOf } from '@/utils/area';
import { eventDate } from '@/utils/jst';
import EventCards from './EventCards';
import BrowseLinks from './BrowseLinks';

export function eventsOn(dates) {
  const wanted = new Set(dates);
  return loadEvents()
    .filter(live => wanted.has(eventDate(live)))
    .sort((a, b) => a.live_date.localeCompare(b.live_date));
}

function countByArea(lives) {
  const counts = new Map();
  for (const live of lives) {
    const slug = areaOf(live.venue);
    if (slug) counts.set(slug, (counts.get(slug) || 0) + 1);
  }
  return AREAS.filter(a => counts.has(a.slug)).map(a => [a, counts.get(a.slug)]);
}

export default function DateEventsPage({ heading, lead, dates, current }) {
  const lives = eventsOn(dates);
  const byArea = countByArea(lives);
  // 1日だけのページは検索のエリア絞り込みへ、複数日(週末)はエリアページへ飛ばす
  const areaHref = area =>
    dates.length === 1 ? `/search?date=${dates[0]}&area=${area.slug}` : `/area/${area.slug}`;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm mb-6">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-blue-500 hover:underline font-bold">← トップに戻る</Link>
          <p className="font-bold text-gray-700">日付別スケジュール</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-3">{heading}</h1>
        <p className="text-center text-sm text-gray-600 mb-8 px-2">
          {lead}東京で開催されるお笑いライブは{lives.length}件です。
        </p>

        {byArea.length > 0 && (
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-8">
            <h2 className="font-bold text-gray-800 mb-3 text-sm">エリアで絞り込む</h2>
            <div className="flex flex-wrap gap-2">
              {byArea.map(([area, count]) => (
                <Link
                  key={area.slug}
                  href={areaHref(area)}
                  className="bg-gray-50 text-gray-700 text-sm py-1.5 px-3 rounded-full border border-gray-200 hover:bg-gray-100"
                >
                  {area.name}（{count}）
                </Link>
              ))}
            </div>
          </div>
        )}

        <EventCards lives={lives} showDateHeadings={dates.length > 1} />

        <div className="mt-12">
          <BrowseLinks current={current} />
        </div>
      </div>
    </div>
  );
}
