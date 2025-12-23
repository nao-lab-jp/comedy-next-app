import supabase from '@/utils/supabase'
import SearchPanel from '@/app/components/SearchPanel'
import { groupArtists } from '@/utils/artistHelper'
import { getCachedAIPickedShows } from '@/utils/recommend-engine'
import { RecommendedShows } from '@/app/components/RecommendedShows'

export const revalidate = 0;

export default async function SearchPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const query = (resolvedParams.q || "").trim();
  const dateParam = resolvedParams.date || "";
  const today = new Date().toISOString().split('T')[0];

  console.log("--- 検索実行ログ ---");
  console.log("検索クエリ:", `"${query}"`);
  console.log("検索日付:", dateParam);

  let results = [];

  if (query || dateParam) {
    let supabaseQuery = supabase.from('lives').select('*');

    // 1. キーワードがある場合 (OR条件)
    if (query) {
      const orCondition = `title.ilike.%${query}%,performers.ilike.%${query}%,venue.ilike.%${query}%,performers_kana.ilike.%${query}%`;
      supabaseQuery = supabaseQuery.or(orCondition);
    }

    // 2. 日付指定がある場合 (AND条件で絞り込み)
    if (dateParam) {
      // 厳密な .eq() だと時間情報で外れることがあるため、その日の「以上・以下」で範囲検索します
      supabaseQuery = supabaseQuery
        .gte('live_date', `${dateParam}T00:00:00`)
        .lte('live_date', `${dateParam}T23:59:59`);
    } else {
      // 日付指定がない場合は今日以降を出す
      supabaseQuery = supabaseQuery.gte('live_date', today);
    }

    const { data, error } = await supabaseQuery.order('live_date', { ascending: true });
    if (!error) results = data || [];
  }

  // 0件時のレコメンド
  let recommendedShows = [];
  if (results.length === 0) {
    const nextWeekStr = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    const { data: candidates } = await supabase.from('lives').select('*').gte('live_date', nextWeekStr).limit(50);
    recommendedShows = candidates ? await getCachedAIPickedShows(candidates) : [];
  }

  const { data: allLives } = await supabase.from('lives').select('*').gte('live_date', today);
  const artistGroups = groupArtists(allLives || []);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-600 text-white py-10 shadow-md">
        <div className="max-w-3xl mx-auto px-4">
          <a href="/" className="text-blue-100 hover:text-white text-sm mb-4 inline-block">← トップへ戻る</a>
          <h1 className="text-2xl font-bold">
            {dateParam && <span className="mr-2 text-white">📅 {dateParam}</span>}
            {query ? `「${query}」の検索結果` : 'ライブ検索結果'}
          </h1>
          <p className="text-blue-100 text-sm mt-2">{results.length} 件見つかりました</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8">
        <SearchPanel artistGroups={artistGroups} />

        <div className="mt-12">
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
                  <h3 className="text-blue-600 font-bold text-lg mb-4">{show.title}</h3>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>📍 {show.venue}</p>
                    <p className="line-clamp-2">👥 {show.performers}</p>
                  </div>
                  <a href={show.source_url} target="_blank" rel="noopener noreferrer" className="mt-6 block text-center bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-500 shadow-sm transition-colors">
                    チケット詳細・購入
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
              <p className="text-gray-500 text-sm mb-12">入力内容を変えてもう一度お試しください。</p>
              
              {recommendedShows.length > 0 && (
                <div className="text-left border-t mt-12 pt-10">
                  <h2 className="text-lg font-bold text-gray-800 mb-8">代わりに来週の注目ライブはいかがですか？</h2>
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