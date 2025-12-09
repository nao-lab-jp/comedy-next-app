// app/search/page.js

import supabase from '../../utils/supabase'
import LiveList from '../components/LiveList'

export const revalidate = 0;

export default async function SearchResultPage({ searchParams }) {
  // ★修正: searchParamsをawaitしてから使う
  const resolvedSearchParams = await searchParams;
  const date = resolvedSearchParams.date || '';
  const keyword = resolvedSearchParams.keyword || '';

  // (以下、変更なし)
  const { data: lives, error } = await supabase
    .from('lives')
    .select('*')
    .gte('live_date', new Date().toISOString().split('T')[0]) 
    .order('live_date', { ascending: true });

  if (error) {
    return <div className="p-8 text-center text-red-500">データ取得エラーが発生しました</div>;
  }

  let filteredLives = lives || [];

  if (date) {
    filteredLives = filteredLives.filter(live => live.live_date && live.live_date.startsWith(date));
  }

  if (keyword) {
    const k = keyword.toLowerCase();
    filteredLives = filteredLives.filter(live => {
      const target = `
        ${live.title} 
        ${live.venue} 
        ${live.performers} 
        ${live.performers_kana ? JSON.stringify(live.performers_kana) : ''}
      `.toLowerCase();
      return target.includes(k);
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm mb-6">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-blue-500 hover:underline font-bold">← トップに戻る</a>
          <h1 className="font-bold text-gray-700">検索結果</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-gray-700">
            <p>📅 日付: <b>{date || '指定なし'}</b></p>
            <p>🔍 キーワード: <b>{keyword || '指定なし'}</b></p>
        </div>

        <h2 className="text-xl font-bold mb-4 text-gray-700 border-l-4 border-red-500 pl-3">
          {filteredLives.length} 件見つかりました
        </h2>

        {filteredLives.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white rounded-lg">
            条件に一致するライブはありませんでした。<br/>
            別のキーワードや日付で試してみてください。
          </div>
        ) : (
          <LiveList initialLives={filteredLives} />
        )}
      </div>
    </div>
  );
}