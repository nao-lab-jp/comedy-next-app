// app/artist/[name]/page.js
import supabase from '@/utils/supabase';
import LiveList from '@/app/components/LiveList';

export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { name } = await params;
  const artistName = decodeURIComponent(name);

  return {
    title: `${artistName}のライブ予定・チケット検索`,
    description: `「${artistName}」が出演する東京のお笑いライブ情報まとめ。チケット予約やスケジュールを確認できます。`,
    openGraph: {
      title: `${artistName}のライブ予定`,
      description: `${artistName}の出演ライブ情報をチェック！`,
    },
  };
}

export default async function ArtistPage({ params }) {
  const { name } = await params;
  const artistName = decodeURIComponent(name);

  // ▼ ① Supabaseから芸人のプロフィール（紹介文）を取得
  const { data: profileData } = await supabase
    .from('artist_profiles')
    .select('description')
    .eq('name', artistName)
    .single();

  // ② ライブ一覧をデータベースから取得
  const { data: lives, error } = await supabase
    .from('lives')
    .select('*')
    .gte('live_date', new Date().toISOString().split('T')[0])
    .order('live_date', { ascending: true });

  if (error) {
    console.error('Supabase error:', error);
    return <div className="p-8 text-center text-red-500">データ取得エラーが発生しました</div>;
  }

  // クライアント側でフィルタリング
  const filteredLives = (lives || []).filter(live => {
    const target = `
      ${live.title} 
      ${live.venue} 
      ${live.performers} 
      ${live.performers_kana || ''}
    `.toLowerCase();
    return target.includes(artistName.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm mb-6">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-blue-500 hover:underline font-bold">← トップに戻る</a>
          <h1 className="font-bold text-gray-700">芸人別スケジュール</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">{artistName}</h2>
            <p className="text-gray-500 text-sm mt-1">の出演ライブ</p>
        </div>

        {/* ▼ ③ 紹介文があれば表示する（SNSやYouTubeはなし） ▼ */}
        {profileData?.description && (
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-8">
            <h3 className="font-bold text-gray-800 mb-2 border-b pb-2">
              {artistName}の紹介・見どころ
            </h3>
            
            {/* whitespace-pre-wrapをつけているので、AIが作った改行も正しく表示されます */}
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
              {profileData.description}
            </p>
          </div>
        )}

        <h3 className="text-lg font-bold mb-4 text-gray-700 border-l-4 border-orange-500 pl-3">
          {filteredLives.length} 件の出演予定
        </h3>

        {filteredLives.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white rounded-lg">
            現在、登録されている出演ライブはありません。<br/>
            （データ更新をお待ちください）
          </div>
        ) : (
          <LiveList initialLives={filteredLives} />
        )}
      </div>
    </div>
  );
}