// app/artist/[name]/page.js
import supabase from '@/utils/supabase';
import LiveList from '@/app/components/LiveList';

export const revalidate = 0;

// ▼ ① テスト用に「独自の紹介文とSNS/YouTubeデータ」を用意する
const artistProfiles = {
  // ▼ 滝音（厚めの紹介文 ＋ SNS ＋ YouTube）
  "滝音": {
    description: "滝音（たきおん）は、吉本興業に所属するさすけと秋定遼太郎によるお笑いコンビ。キングオブコント2020ファイナリストであり、M-1グランプリでも幾度も準決勝へ進出する実力派です。最大の特徴は、ツッコミのさすけが放つ「ベイビーワード」と呼ばれる独特な造語（例：「あたおか」「よだれだこ」など）を用いた唯一無二の漫才とコント。ボケの秋定が放つ脱力系のボケに対し、甲高い声で放たれる予測不能なツッコミフレーズが劇場で爆笑をさらっています。2024年4月からは大阪のよしもと漫才劇場を卒業し、活動の拠点を東京へと移しました。テレビ出演はもちろん、ルミネtheよしもとや神保町よしもと漫才劇場など、東京のライブシーンでも欠かせない存在として日々舞台に立ち続けています。",
    twitter: [
      { name: "さすけ", id: "agomonchaku" },
      { name: "秋定", id: "sadarow" } // ※秋定さんの実際のIDに書き換えてください
    ],
    instagram: [
      { name: "さすけ", id: "agomonchaku" },
      { name: "秋定", id: "ryotaroakisada" } // ※秋定さんの実際のIDに書き換えてください
    ],
    youtube_id: "HWkR9t6nVM4" // 例: 埋め込みたいYouTube動画のID（URLの v= の後の文字列）
  },
  
  // ▼ 虹の黄昏（軽めの紹介文 ＋ Xのみ）
  "虹の黄昏": {
    description: "虹の黄昏（にじのたそがれ）は、かまぼこ体育館と野沢ダイブ禁止によるフリーのお笑いコンビ。「地下お笑い界の帝王」とも呼ばれ、小道具を使った予測不能でハイテンションな芸風が特徴です。",
    twitter: "zeetei2buukamas" // 例: 公式アカウントID
  }
};

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

  // ▼ ② 用意したデータの中から、今回の芸人さんのデータがあるか探す
  const profileData = artistProfiles[artistName];

  // データベースから検索
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

        {/* ▼ ③ ここから追加：プロフィールデータやSNS/YouTubeがあれば表示する ▼ */}
        {profileData && (
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-8">
            <h3 className="font-bold text-gray-800 mb-2 border-b pb-2">
              {artistName}の紹介・公式リンク
            </h3>
            
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {profileData.description}
            </p>

            {/* SNSリンクの表示（データが存在する場合のみ表示） */}
            {(profileData.twitter || profileData.instagram) && (
              <div className="flex gap-3 mb-4">
                {profileData.twitter && (
                  <a 
                    href={`https://x.com/${profileData.twitter}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs bg-black text-white px-3 py-1.5 rounded-full hover:opacity-80 transition"
                  >
                    X (Twitter)
                  </a>
                )}
                {profileData.instagram && (
                  <a 
                    href={`https://instagram.com/${profileData.instagram}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full hover:opacity-80 transition"
                  >
                    Instagram
                  </a>
                )}
              </div>
            )}

            {/* YouTubeの埋め込み表示（データが存在する場合のみ表示） */}
            {profileData.youtube_id && (
              <div className="aspect-video w-full mt-2">
                <iframe
                  className="w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${profileData.youtube_id}`}
                  title={`${artistName}のYouTube動画`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        )}
        {/* ▲ ここまで追加 ▲ */}

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