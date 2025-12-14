// app/search/page.js

// ▼ 修正箇所: @ を使ってルートからパスを指定（これで階層エラーが消えます）
import supabase from '@/utils/supabase'; 
import LiveList from '@/components/LiveList';

export const revalidate = 0;

// ▼ SEO対策: 検索条件に合わせてタイトルを動的に変える設定
export async function generateMetadata({ searchParams }) {
  // searchParams を解決（Next.js 15対応）
  const resolvedSearchParams = await searchParams;
  const keyword = resolvedSearchParams.keyword || '';
  const date = resolvedSearchParams.date || '';

  let title = '検索結果';
  let description = '東京のお笑いライブ検索結果一覧です。';

  if (keyword && date) {
    title = `「${keyword}」 ${date} のライブ検索結果`;
    description = `キーワード「${keyword}」、日付「${date}」での検索結果です。`;
  } else if (keyword) {
    title = `「${keyword}」のライブ検索結果`;
    description = `「${keyword}」に関連する東京のお笑いライブ情報です。`;
  } else if (date) {
    title = `${date} のライブ検索結果`;
    description = `${date}に開催される東京のお笑いライブ情報です。`;
  }

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
    // Google検索のインデックスを許可しない（検索結果ページは除外するのが一般的）
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SearchResultPage({ searchParams }) {
  // searchParamsをawaitしてから使う
  const resolvedSearchParams = await searchParams;
  const date = resolvedSearchParams.date || '';
  const keyword = resolvedSearchParams.keyword || '';

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