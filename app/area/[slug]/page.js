import Link from 'next/link';
import { notFound } from 'next/navigation';
import { loadEvents } from '@/utils/events';
import { AREAS, areaBySlug, areaOf } from '@/utils/area';
import { displayVenue } from '@/utils/venue';
import { addDays, eventDate, jstToday } from '@/utils/jst';
import EventCards from '@/app/components/EventCards';
import BrowseLinks from '@/app/components/BrowseLinks';

// 掲載内容が変わるのはスクレイパーのpush(=再デプロイ)時と、日付が進んで
// 過去の公演が外れる時だけ。エリアは9つしかないので1時間ごとに作り直しても軽い。
export const revalidate = 3600;
export const dynamicParams = false;

// 1ページが重くなりすぎないよう、直近30日・最大150件までにする
const DAYS_AHEAD = 30;
const MAX_EVENTS = 150;

export function generateStaticParams() {
  return AREAS.map(area => ({ slug: area.slug }));
}

function upcomingInArea(slug) {
  const today = jstToday();
  return loadEvents()
    .filter(live => eventDate(live) >= today && areaOf(live.venue) === slug)
    .sort((a, b) => a.live_date.localeCompare(b.live_date));
}

function topVenues(lives, limit = 8) {
  const counts = new Map();
  for (const live of lives) {
    const name = displayVenue(live.venue);
    if (name) counts.set(name, (counts.get(name) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const area = areaBySlug(slug);
  if (!area) return {};

  const lives = upcomingInArea(slug);
  const venues = topVenues(lives, 3).map(([name]) => name).join('・');

  return {
    title: `${area.name}のお笑いライブ スケジュール`,
    description: `${area.name}エリアで開催されるお笑いライブの一覧（今後${lives.length}件）。${venues ? `${venues}など。` : ''}日付・出演者からチケット情報を確認できます。`,
    ...(lives.length === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function AreaPage({ params }) {
  const { slug } = await params;
  const area = areaBySlug(slug);
  if (!area) notFound();

  const today = jstToday();
  const lives = upcomingInArea(slug);
  const until = addDays(today, DAYS_AHEAD);
  const shown = lives.filter(live => eventDate(live) < until).slice(0, MAX_EVENTS);
  const venues = topVenues(lives);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm mb-6">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-blue-500 hover:underline font-bold">← トップに戻る</Link>
          <p className="font-bold text-gray-700">エリア別スケジュール</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-3">
          {area.name}のお笑いライブ
        </h1>
        <p className="text-center text-sm text-gray-600 mb-8 px-2">
          {area.name}エリアで今後開催予定のお笑いライブは{lives.length}件です。
          {venues.length > 0 && `主な会場は${venues.slice(0, 3).map(([name]) => name).join('、')}など。`}
        </p>

        {venues.length > 0 && (
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-8">
            <h2 className="font-bold text-gray-800 mb-3 text-sm">{area.name}の主な会場</h2>
            <div className="flex flex-wrap gap-2">
              {venues.map(([name, count]) => (
                <Link
                  key={name}
                  href={`/search?area=${area.slug}&q=${encodeURIComponent(name)}`}
                  className="bg-gray-50 text-gray-700 text-sm py-1.5 px-3 rounded-full border border-gray-200 hover:bg-gray-100"
                >
                  {name}（{count}）
                </Link>
              ))}
            </div>
          </div>
        )}

        <EventCards lives={shown} />

        {lives.length > shown.length && (
          <p className="text-center text-sm text-gray-500 mt-6">
            ここでは直近{DAYS_AHEAD}日分を表示しています。
            <Link href={`/search?area=${area.slug}`} className="text-blue-600 hover:underline ml-1">
              {area.name}のライブをすべて見る（{lives.length}件）
            </Link>
          </p>
        )}

        <div className="mt-12">
          <BrowseLinks current={`/area/${area.slug}`} />
        </div>
      </div>
    </div>
  );
}
