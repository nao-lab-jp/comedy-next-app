import Link from 'next/link'
import SearchPanel from './components/SearchPanel'
import SpecialFeatures from './components/SpecialFeatures'
import { groupArtists } from '../utils/artistHelper'
import { loadEvents } from '../utils/events'
import { getCachedAIPickedShows } from '../utils/recommend-engine'
import { RecommendedShows } from './components/RecommendedShows'

// トップページ全体を24時間キャッシュ
export const revalidate = 86400;

export default async function Home() {
  const today = new Date().toISOString().split('T')[0];

  const nextWeekStart = new Date();
  nextWeekStart.setDate(nextWeekStart.getDate() + 7);
  const nextWeekStr = nextWeekStart.toISOString().split('T')[0];

  const events = loadEvents();

  // 1. 芸人リスト作成用の全データ取得
  const allLives = events.filter(live => live.live_date >= today);

  // 2. AIレコメンド用の候補取得
  const candidates = events
    .filter(live => live.live_date >= nextWeekStr)
    .sort((a, b) => a.live_date.localeCompare(b.live_date))
    .slice(0, 50);

  const artistGroups = groupArtists(allLives || []);

  // 3. キャッシュされたレコメンドを取得
  const recommendedShows = candidates ? await getCachedAIPickedShows(candidates) : [];

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* ▼ 修正箇所: ヘッダー部分
        スマホ: 縦並び(flex-col)で表示
        PC(md以上): 横並び(flex-row)に戻し、リンクを絶対配置(absolute)で右端へ
      */}
      <div className="bg-white p-4 md:p-6 shadow-sm mb-6 relative flex flex-col md:flex-row items-center justify-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-0">
          🗼 東京お笑いライブ検索
        </h1>
        
        <Link href="/guide" className="text-sm font-bold text-gray-600 hover:text-blue-600 flex items-center gap-1 md:absolute md:right-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          ご利用ガイド
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <SearchPanel artistGroups={artistGroups} />

        {/* 特集エリア */}
        <SpecialFeatures />

        {recommendedShows.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-bold text-gray-800">来週の注目ライブ</h2>
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                AI厳選
              </span>
            </div>
            <RecommendedShows shows={recommendedShows} />
          </div>
        )}

        <div className="mt-12 text-center text-gray-500 text-sm border-t pt-8">
            <p>日付やキーワードを入力して「検索する」ボタンを押してください。</p>
            <p className="mt-2">または、上のタブから芸人名を選んで探せます。</p>
        </div>
      </div>
    </main>
  );
}