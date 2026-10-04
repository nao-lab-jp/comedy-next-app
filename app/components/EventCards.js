// エリア別・日付別ページで使う公演一覧(サーバーコンポーネント)。
// 日付ごとにまとめ、出演者は芸人ページにリンクする(芸人ページの発見を助ける内部リンク)。
import Link from 'next/link';
import { displayVenue } from '@/utils/venue';
import { eventDate, eventTime, formatMonthDay } from '@/utils/jst';

function groupByDate(lives) {
  const groups = new Map();
  for (const live of lives) {
    const date = eventDate(live);
    if (!groups.has(date)) groups.set(date, []);
    groups.get(date).push(live);
  }
  return [...groups.entries()];
}

function EventCard({ live }) {
  const time = eventTime(live);
  const venue = displayVenue(live.venue);
  const performers = Array.isArray(live.performers_clean) ? live.performers_clean : [];

  return (
    <li className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex items-baseline gap-3">
        <span className="shrink-0 text-sm font-bold text-gray-500 w-12">{time || '—'}</span>
        <div className="min-w-0 flex-1">
          <a
            href={live.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-blue-600 hover:underline"
          >
            {live.title}
          </a>
          {venue && <p className="text-sm text-gray-600 mt-1">📍 {venue}</p>}
          {performers.length > 0 && (
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              {performers.map((name, i) => (
                <span key={`${name}-${i}`}>
                  {i > 0 && ' / '}
                  <Link href={`/artist/${encodeURIComponent(name)}`} className="text-blue-600 hover:underline">
                    {name}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

export default function EventCards({ lives, showDateHeadings = true }) {
  if (!lives.length) {
    return (
      <p className="text-center text-gray-500 bg-white rounded-lg py-10">
        掲載中のライブはありません。
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {groupByDate(lives).map(([date, items]) => (
        <section key={date}>
          {showDateHeadings && (
            <h2 className="text-base font-bold text-gray-700 border-l-4 border-orange-500 pl-3 mb-3">
              {formatMonthDay(date)}（{items.length}件）
            </h2>
          )}
          <ul className="space-y-3">
            {items.map((live, i) => (
              <EventCard key={`${live.source_url}-${i}`} live={live} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
