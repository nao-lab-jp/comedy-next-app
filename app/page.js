import supabase from '../utils/supabase'
import SearchPanel from './components/SearchPanel'
import { groupArtists } from '../utils/artistHelper'

export const revalidate = 0;

export default async function Home() {
  // 1. 芸人リスト作成のためにデータを取得
  // (検索用データではないので軽量化してもOKですが、今はそのままで)
  const { data: lives } = await supabase
    .from('lives')
    .select('*')
    .gte('live_date', new Date().toISOString().split('T')[0]);

  // 2. 芸人名をグループ化
  const artistGroups = groupArtists(lives || []);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-6 shadow-sm mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">🗼 東京お笑いライブ検索</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {/* 検索パネルを表示 (onSearchなどは不要になりました) */}
        <SearchPanel artistGroups={artistGroups} />

        {/* トップページには検索結果を出さず、案内などを置く */}
        <div className="mt-8 text-center text-gray-500 text-sm">
            <p>日付やキーワードを入力して「検索する」ボタンを押してください。</p>
            <p className="mt-2">または、上のタブから芸人名を選んで探せます。</p>
        </div>
      </div>
    </main>
  );
}