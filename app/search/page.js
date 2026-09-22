import { loadEvents } from '@/utils/events'
// ★修正: SearchPanel と groupArtists のインポートを削除（不要になったため）
import { getCachedAIPickedShows } from '@/utils/recommend-engine'
import { RecommendedShows } from '@/app/components/RecommendedShows'

export const revalidate = 0;

// SEO-PLAN.md P1-2: /artist/{name} と内容が重複するため noindex。
// followを付けて検索結果ページ経由のリンクは辿らせる(ユーザー機能としては維持)。
export async function generateMetadata() {
  return {
    robots: {
      index: false,
      follow: true,
    },
  };
}

function matchesKeyword(live, keyword) {
  const k = keyword.toLowerCase();
  return (
    (live.title || '').toLowerCase().includes(k) ||
    (live.performers || '').toLowerCase().includes(k) ||
    (live.venue || '').toLowerCase().includes(k) ||
    (live.performers_kana || '').toLowerCase().includes(k)
  );
}

export default async function SearchPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const query = (resolvedParams.q || "").trim();
  const dateParam = resolvedParams.date || "";
  const today = new Date().toISOString().split('T')[0];
  const events = loadEvents();

  // 1. 検索ロジック
  let results = [];
  if (query || dateParam) {
    // 日付検索 (AND条件)
    if (dateParam) {
      results = events.filter(live => live.live_date.startsWith(dateParam));
    } else {
      results = events.filter(live => live.live_date >= today);
    }

    // キーワード検索 (OR条件)
    if (query) {
      results = results.filter(live => matchesKeyword(live, query));
    }

    results = [...results].sort((a, b) => a.live_date.localeCompare(b.live_date));
  }

  // 2. 0件時のAIレコメンド
  let recommendedShows = [];
  if (results.length === 0) {
    const nextWeekStr = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    const candidates = events.filter(live => live.live_date >= nextWeekStr).slice(0, 50);
    recommendedShows = candidates.length > 0 ? await getCachedAIPickedShows(candidates) : [];
  }

  // ★修正: SearchPanel用の「芸人データ取得処理」を丸ごと削除

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* 青いヘッダー部分 */}
      <div className="bg-blue-600 text-white py-8 shadow-md">
        <div className="max-w-3xl mx-auto px-4">
          <a href="/" className="text-blue-100 hover:text-white text-sm mb-4 inline-block font-bold">← トップへ戻る</a>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {dateParam && <span className="bg-blue-700 px-2 py-1 rounded text-lg">📅 {dateParam}</span>}
            {query ? `「${query}」の検索結果` : 'ライブ検索結果'}
          </h1>
          <p className="text-blue-100 text-sm mt-3 ml-1 font-medium">{results.length} 件見つかりました</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8">
        {/* ★修正: ここにあった <SearchPanel /> を削除しました */}

        {/* 結果リストの表示 */}
        <div className="">
          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((show) => (
                <div key={show.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-gray-400">
                      📅 {show.live_date?.split('T')[0]}
                    </span>
                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold">販売中</span>
                  </div>
                  <h3 className="text-blue-600 font-bold text-lg mb-4 leading-tight">{show.title}</h3>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p className="flex items-center gap-2"><span className="text-gray-400">📍</span> {show.venue}</p>
                    <p className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">👥</span>
                      <span className="line-clamp-2">{show.performers}</span>
                    </p>
                  </div>
                  <a href={show.source_url} target="_blank" rel="noopener noreferrer" className="mt-6 block text-center bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-500 shadow-sm transition-colors">
                    チケット詳細・購入
                  </a>
                </div>
              ))}
            </div>
          ) : (
            // 0件の時の表示
            <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-dashed border-gray-300 mt-4">
              <div className="text-5xl mb-6">🔍</div>
              <p className="text-gray-800 font-bold text-lg mb-2">
                一致するライブは見つかりませんでした
              </p>
              <p className="text-gray-500 text-sm mb-12">条件を変更して再度お試しください。</p>
              
              {recommendedShows.length > 0 && (
                <div className="text-left border-t mt-12 pt-10">
                  <h2 className="text-lg font-bold text-gray-800 mb-8">代わりに来週の注目ライブはいかがですか？</h2>
                  <RecommendedShows shows={recommendedShows} />
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* ページ下部にも戻るボタンを配置（長いリストを見た後に便利） */}
        <div className="mt-12 text-center pb-8">
           <a href="/" className="inline-block px-6 py-2 border border-blue-600 text-blue-600 rounded-full font-bold hover:bg-blue-50 transition">
             条件を変えて再検索する（トップへ）
           </a>
        </div>
      </div>
    </main>
  );
}