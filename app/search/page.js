import supabase from '@/utils/supabase'
import SearchPanel from '@/app/components/SearchPanel'
import { groupArtists } from '@/utils/artistHelper'
import { getCachedAIPickedShows } from '@/utils/recommend-engine'
import { RecommendedShows } from '@/app/components/RecommendedShows'

export const revalidate = 0;

export default async function SearchPage({ searchParams }) {
  // 1. Next.js 15: searchParamsをawaitして確実に取得
  const resolvedParams = await searchParams;
  
  // .trim() を追加して、スペースだけの入力も空として扱う
  const query = (resolvedParams.q || "").trim();
  const dateParam = resolvedParams.date || "";
  
  const today = new Date().toISOString().split('T')[0];

  // 2. 検索クエリの構築
  // 最初から「今日以降」という条件をベースにする
  let supabaseQuery = supabase
    .from('lives')
    .select('*')
    .gte('live_date', today)
    .order('live_date', { ascending: true });

  // --- 修正の要：検索実行の判定 ---
  let results = [];
  
  // キーワードまたは日付、どちらかの指定がある場合のみDBに問い合わせる
  if (query || dateParam) {
    if (query) {
      // 部分一致検索を適用
      supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,performers.ilike.%${query}%`);
    }
    if (dateParam) {
      // 日付指定があればさらに絞り込み
      supabaseQuery = supabaseQuery.eq('live_date', dateParam);
    }
    
    const { data } = await supabaseQuery;
    results = data || [];
  } else {
    // キーワードも日付も空なら、何も検索せず 0件とする
    results = [];
  }

  // 3. 検索結果が0件の場合のみ、AIレコメンドを準備
  let recommendedShows = [];
  if (results.length === 0) {
    const nextWeekStart = new Date();
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    const nextWeekStr = nextWeekStart.toISOString().split('T')[0];
    
    // おすすめ用候補（来週以降）
    const { data: candidates } = await supabase
      .from('lives')
      .select('*')
      .gte('live_date', nextWeekStr)
      .limit(50);
      
    recommendedShows = candidates ? await getCachedAIPickedShows(candidates) : [];
  }

  // 4. 検索パネル再表示用
  const { data: allLives } = await supabase.from('lives').select('*').gte('live_date', today);
  const artistGroups = groupArtists(allLives || []);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-600 text-white py-10 shadow-md">
        <div className="max-w-3xl mx-auto px-4">
          <a href="/" className="text-blue-100 hover:text-white text-sm mb-4 inline-block">← トップに戻る</a>
          <h1 className="text-2xl font-bold">
            {dateParam && <span className="mr-2">📅 {dateParam}</span>}
            {query ? `「${query}」の検索結果` : '検索結果'}
          </h1>
          <p className="text-blue-100 text-sm mt-2">{results.length} 件見つかりました</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8">
        {/* 再検索パネル */}
        <SearchPanel artistGroups={artistGroups} />

        <div className="mt-12">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {results.map((show) => (
                <div key={show.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <div className="text-xs font-bold text-gray-400 mb-2">
                    {/* 日付の表示を見やすく修正（T00:00...をカット） */}
                    📅 {show.live_date ? show.live_date.split('T')[0] : ''}
                  </div>
                  <h3 className="text-blue-600 font-bold text-lg mb-3 leading-snug">
                    {show.title}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>📍 会場: {show.venue}</p>
                    <p className="line-clamp-2">👥 出演: {show.performers}</p>
                  </div>
                  <a 
                    href={show.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-5 block text-center bg-yellow-400 text-gray-900 text-sm font-bold py-2.5 rounded-lg hover:bg-yellow-500 shadow-sm"
                  >
                    詳細・購入
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-dashed border-gray-300">
              <div className="text-5xl mb-6">🔍</div>
              <p className="text-gray-800 font-bold text-lg mb-2">
                一致するライブは見つかりませんでした
              </p>
              <p className="text-gray-500 text-sm mb-12">
                キーワードを変えるか、日付を指定して再度お試しください。
              </p>
              
              {recommendedShows.length > 0 && (
                <div className="text-left border-t pt-10">
                  <div className="flex items-center gap-2 mb-6">
                    <h2 className="text-lg font-bold text-gray-800">代わりに来週の注目ライブはいかがですか？</h2>
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">AI厳選</span>
                  </div>
                  <RecommendedShows shows={recommendedShows} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}