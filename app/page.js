import Link from 'next/link'
import supabase from '../utils/supabase'
import SearchPanel from './components/SearchPanel'
import SpecialFeatures from './components/SpecialFeatures' // 1. 追加: 特集コンポーネントを読み込み
import { groupArtists } from '../utils/artistHelper'
import { getCachedAIPickedShows } from '../utils/recommend-engine' // ★キャッシュ版に変更
import { RecommendedShows } from './components/RecommendedShows'

// トップページ全体を24時間キャッシュ
export const revalidate = 86400;

export default async function Home() {
  const today = new Date().toISOString().split('T')[0];
  
  const nextWeekStart = new Date();
  nextWeekStart.setDate(nextWeekStart.getDate() + 7);
  const nextWeekStr = nextWeekStart.toISOString().split('T')[0];

  // 1. 芸人リスト作成用の全データ取得
  const { data: allLives } = await supabase
    .from('lives')
    .select('*')
    .gte('live_date', today);

  // 2. AIレコメンド用の候補取得
  const { data: candidates } = await supabase
    .from('lives')
    .select('*')
    .gte('live_date', nextWeekStr)
    .order('live_date', { ascending: true })
    .limit(50);

  const artistGroups = groupArtists(allLives || []);

  // 3. ★ここを getCachedAIPickedShows に変更
  // これにより、検索ページで保存された結果があれば、それをそのまま使い回します
  const recommendedShows = candidates ? await getCachedAIPickedShows(candidates) : [];

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー：タイトル中央、リンク右端固定 */}
      <div className="bg-white p-6 shadow-sm mb-6 relative flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">🗼 東京お笑いライブ検索</h1>
        
        <Link href="/guide" className="absolute right-6 text-sm font-bold text-gray-600 hover:text-blue-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          ご利用ガイド
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <SearchPanel artistGroups={artistGroups} />

        {/* 2. 追加: 特集エリア（M-1/KOCなど） */}
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