// app/artist/[name]/page.js
import supabase from '@/utils/supabase';
import { loadEvents } from '@/utils/events';
import { loadArtistStats } from '@/utils/artistStats';
import LiveList from '@/app/components/LiveList';

export const revalidate = 0;

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

function formatShortDateWithWeekday(dateStr) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}月${d.getDate()}日（${WEEKDAYS[d.getDay()]}）`;
}

function formatFullDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

// SEO-PLAN.md P0-1: 芸人ごとに固有の1〜2行サマリーを作る。
// 出演予定がある/なしで文言を出し分ける(0件パターンはソフト404対策にもなる)。
function buildSummary(artistName, upcomingLives, stats) {
  const totalCount = stats?.total_count ?? upcomingLives.length;

  if (upcomingLives.length > 0) {
    const next = upcomingLives[0];
    return `${artistName}の次回出演は${formatShortDateWithWeekday(next.live_date)}${next.venue}。今後の予定${upcomingLives.length}件、過去を含めて${totalCount}件を掲載しています。`;
  }

  if (stats?.last_appearance) {
    return `${artistName}の今後の出演予定は現在掲載がありません。直近の出演は${formatFullDate(stats.last_appearance.date)}（${stats.last_appearance.venue}）でした。過去を含めて${totalCount}件を掲載しています。`;
  }

  return `${artistName}の今後の出演予定は現在掲載がありません。`;
}

export async function generateMetadata({ params }) {
  const { name } = await params;
  const artistName = decodeURIComponent(name);

  // SEO-PLAN.md P1-1: 過去も含めて出演実績が一件も無いページ(データ取得ミスで
  // 生成された芸人名など)は実質中身が無いため noindex にする(ソフト404対策)。
  const stats = loadArtistStats()[artistName];
  const hasContent = (stats?.total_count ?? 0) > 0;

  return {
    title: `${artistName}のライブ予定・チケット検索`,
    description: `「${artistName}」が出演する東京のお笑いライブ情報まとめ。チケット予約やスケジュールを確認できます。`,
    ...(hasContent ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      title: `${artistName}のライブ予定`,
      description: `${artistName}の出演ライブ情報をチェック！`,
    },
  };
}

export default async function ArtistPage({ params }) {
  const { name } = await params;
  const artistName = decodeURIComponent(name);

  // ▼ ① Supabaseから芸人のプロフィールと、アフィリエイトリンク（afi_link）を取得
  // egress超過でAPIがブロックされている間は失敗しうるので、落とさず握りつぶす
  let profileData = null;
  try {
    const { data } = await supabase
      .from('artist_profiles')
      .select('description, afi_link') // ← ここを afi_link に変更
      .eq('name', artistName)
      .single();
    profileData = data;
  } catch (err) {
    console.error('Supabase error (artist_profiles):', err);
  }

  // ② ライブ一覧は静的スナップショット(events.json)から取得
  const today = new Date().toISOString().split('T')[0];
  const lives = loadEvents()
    .filter(live => live.live_date >= today)
    .sort((a, b) => a.live_date.localeCompare(b.live_date));

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

  // ③ 過去の出演履歴・よく出演する会場・よく共演する芸人はスクレイパー側で事前集計した静的JSONから取得
  const stats = loadArtistStats()[artistName];
  const summary = buildSummary(artistName, filteredLives, stats);
  const pastLives = stats?.past || [];
  const visiblePast = pastLives.slice(0, 10);
  const hiddenPast = pastLives.slice(10);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm mb-6">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-blue-500 hover:underline font-bold">← トップに戻る</a>
          <p className="font-bold text-gray-700">芸人別スケジュール</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {artistName}
            <span className="block text-gray-500 text-sm font-normal mt-1">の出演ライブ</span>
          </h1>
        </div>

        <p className="text-center text-sm text-gray-600 mb-8 px-2">
          {summary}
        </p>

        {/* ▼ 紹介文があれば表示する */}
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

        {/* ▼ afi_link に値がある芸人のみAmazonボタンを表示 */}
        {profileData?.afi_link && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8 text-center">
            <h4 className="font-bold text-gray-800 text-sm mb-3">
              📺 {artistName} の出演・関連作品をチェック！
            </h4>
            <a
              href={profileData.afi_link} // ← ここを afi_link に変更
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#FF9900] hover:bg-[#E38800] text-white font-bold px-6 py-3 rounded-lg shadow-md transition-colors text-sm"
            >
              ▶ Amazonプライムビデオ（無料体験あり）で見る
            </a>
            <p className="text-[10px] text-gray-400 mt-2">
              ※時期により配信内容が異なる場合があります。リンク先でご確認ください。
            </p>
          </div>
        )}

        <h2 className="text-lg font-bold mb-4 text-gray-700 border-l-4 border-orange-500 pl-3">
          今後の出演予定（{filteredLives.length}件）
        </h2>

        {filteredLives.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white rounded-lg">
            現在、登録されている出演ライブはありません。<br/>
            （データ更新をお待ちください）
          </div>
        ) : (
          <LiveList initialLives={filteredLives} />
        )}

        {stats?.top_venues?.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-bold mb-3 text-gray-700 border-l-4 border-blue-400 pl-3">
              よく出演する会場
            </h2>
            <div className="flex flex-wrap gap-2">
              {stats.top_venues.map(({ venue, count }) => (
                <span key={venue} className="bg-white text-gray-700 text-sm py-1.5 px-3 rounded-full border border-gray-200 shadow-sm">
                  {venue}（{count}）
                </span>
              ))}
            </div>
          </div>
        )}

        {stats?.top_co_performers?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-3 text-gray-700 border-l-4 border-blue-400 pl-3">
              よく共演する芸人
            </h2>
            <div className="flex flex-wrap gap-2">
              {stats.top_co_performers.map(({ name: coName, count }) => (
                <a
                  key={coName}
                  href={`/artist/${encodeURIComponent(coName)}`}
                  className="bg-white hover:bg-blue-50 text-blue-600 text-sm py-1.5 px-3 rounded-full border border-gray-200 shadow-sm transition-colors"
                >
                  {coName}（{count}）
                </a>
              ))}
            </div>
          </div>
        )}

        {pastLives.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-bold mb-3 text-gray-700 border-l-4 border-gray-400 pl-3">
              過去の出演履歴（{stats.total_count}件）
            </h2>
            <ul className="space-y-2">
              {visiblePast.map((live, i) => (
                <li key={`${live.date}-${i}`} className="bg-white p-3 rounded-lg border border-gray-100 text-sm text-gray-600">
                  <span className="text-gray-400 mr-2">{live.date}</span>
                  {live.venue}{live.title ? ` - ${live.title}` : ''}
                </li>
              ))}
            </ul>

            {hiddenPast.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-blue-600 py-2">
                  過去の出演履歴をすべて見る（{stats.total_count}件）
                </summary>
                <ul className="space-y-2 mt-2">
                  {hiddenPast.map((live, i) => (
                    <li key={`${live.date}-${i}`} className="bg-white p-3 rounded-lg border border-gray-100 text-sm text-gray-600">
                      <span className="text-gray-400 mr-2">{live.date}</span>
                      {live.venue}{live.title ? ` - ${live.title}` : ''}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
