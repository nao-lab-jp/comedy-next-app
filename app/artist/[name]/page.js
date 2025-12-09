// app/artist/[name]/page.js

import supabase from '../../../utils/supabase'

export async function generateMetadata({ params }) {
  // ★修正: paramsをawaitする
  const resolvedParams = await params;
  const artistName = decodeURIComponent(resolvedParams.name)
  const year = new Date().getFullYear()
  
  return {
    title: `${artistName}のライブ・チケット情報 ${year} | 東京お笑いライブ検索`,
    description: `${artistName}の出演するお笑いライブ日程をまとめて検索できます。`,
  }
}

export default async function ArtistPage({ params }) {
  // ★修正: paramsをawaitしてから使う
  const resolvedParams = await params;
  const artistName = decodeURIComponent(resolvedParams.name)
  
  const today = new Date().toISOString().split('T')[0]

  const { data: lives, error } = await supabase
    .from('lives')
    .select('*')
    .ilike('performers', `%${artistName}%`) 
    .gte('live_date', today)
    .order('live_date', { ascending: true });

  if (error) {
    console.error(error);
    return <div className="p-8">エラーが発生しました</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* (中身は変更なし) */}
      <div className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <a href="/" className="text-blue-500 hover:underline text-sm">← トップページに戻る</a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">🎤 {artistName}</h1>
        <p className="text-gray-600 mb-8">{artistName} の出演ライブ・チケット情報</p>

        {(!lives || lives.length === 0) ? (
            <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
              <p>現在予定されているライブ情報は見つかりませんでした。</p>
            </div>
        ) : (
            <ul className="space-y-4">
            {lives.map((live) => (
                <li key={live.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold mb-2 text-blue-600">
                    <a href={live.source_url} target="_blank" rel="noreferrer" className="hover:underline">
                        {live.title}
                    </a>
                    </h2>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                    {live.ticket_status || '販売中'}
                    </span>
                </div>
                <div className="text-gray-700 mt-2 space-y-1">
                    <p suppressHydrationWarning>
                    📅 日時: {new Date(live.live_date).toLocaleString('ja-JP', {
                        year: 'numeric', month: 'numeric', day: 'numeric', 
                        hour: '2-digit', minute: '2-digit', weekday: 'short' 
                    })}
                    </p>
                    <p>📍 会場: {live.venue}</p>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        出演: {live.performers}
                    </p>
                </div>
                </li>
            ))}
            </ul>
        )}
      </div>
    </div>
  )
}