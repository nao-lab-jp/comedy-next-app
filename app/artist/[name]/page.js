// app/artist/[name]/page.js
import supabase from '@/utils/supabase';
import { loadEvents } from '@/utils/events';
import { loadArtistStats } from '@/utils/artistStats';
import { displayVenue } from '@/utils/venue';
import LiveList from '@/app/components/LiveList';
import { amazonUrl, productsFor } from './amazonProducts';

// 以前は revalidate = 0 で毎リクエスト描画していたため、2,900ページ超をGooglebotが
// クロールするたびに関数が起動し、Vercelの無料枠(Fluid Active CPU 4時間)を圧迫していた。
// 表示内容が変わるのはスクレイパーがpushして再デプロイされたときだけ(再デプロイで
// キャッシュは破棄される)なので、長めにキャッシュして問題ない。
// artist_profiles のSupabase参照も毎回発生しなくなるため、egress対策にもなる。
//
// 2026-10-08: 1日 → 2日に延長。スクレイパーは2日おきにpushして再デプロイ(=全キャッシュ
// 破棄)されるので、1日だと次のデプロイまでに1回余分に描き直していた。Fluid Active CPU が
// 直近30日で 3時間54分/4時間に達しており(超過すると30日間停止)、描画回数を減らす必要があった。
export const revalidate = 172800;

// 動的セグメントは generateStaticParams が無いとISRに載らず、revalidateを指定しても
// 毎リクエスト描画される(ビルド出力で ƒ Dynamic と判定される)。
// 空配列を返してビルド時の事前生成は行わず、アクセスされたものだけ描画してキャッシュする。
export async function generateStaticParams() {
  return [];
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

function formatShortDateWithWeekday(dateStr) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}月${d.getDate()}日（${WEEKDAYS[d.getDay()]}）`;
}

function formatFullDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

// 出演者名の区切り文字。scraper側の clean_performers_strict() と揃えてある
// (「・」は「ア・ダンチ！」のように名前の一部になるため区切りに含めない)。
// 商品の種別ごとの見せ方。Amazonの商品画像は規約上使えないため、
// アイコンと色で「何の商品か」を一目で分かるようにしている。
const KIND_STYLES = {
  'Kindle': { icon: '📖', box: 'bg-amber-50 border-amber-200 text-amber-800' },
  '本': { icon: '📗', box: 'bg-blue-50 border-blue-200 text-blue-800' },
  'DVD': { icon: '💿', box: 'bg-purple-50 border-purple-200 text-purple-800' },
  'ビデオ': { icon: '▶️', box: 'bg-sky-50 border-sky-200 text-sky-800' },
  'おもちゃ': { icon: '🧸', box: 'bg-pink-50 border-pink-200 text-pink-800' },
  default: { icon: '🛒', box: 'bg-gray-50 border-gray-200 text-gray-700' },
};

const PERFORMER_SEPARATORS = /[/／,、\n　 ]+/;
const PARENTHESES = /[（(]([^）)]*)[）)]/g;

// 以前はタイトル・会場・出演者を繋いだ文字列に対する部分一致で絞り込んでいたため、
// 「スパイク」の一覧に「スパイクシンフォニー」の公演が混ざっていた。会場名やタイトルに
// 芸人名が含まれるだけの公演(例:「六本木ピンセット」がピンセットの予定に出る)も拾っていた。
// 出演者名を1件ずつ取り出して完全一致で判定する。過去の出演履歴を作っている
// scraper側(publish_artist_stats.py)も performers_clean の完全一致なので、これで揃う。
function performerNames(live) {
  const raw = String(live.performers || '');
  const candidates = [
    // scraperが整形済みの配列。ただし「解答者：麒麟」のように役割ラベルが残ることがある
    ...(live.performers_clean || []),
    // 「粗品（霜降り明星）」の括弧内。分割前に取り出さないと括弧内の空白で切れてしまう
    ...[...raw.matchAll(PARENTHESES)].map(m => m[1]),
    ...raw.replace(PARENTHESES, ' ').split(PERFORMER_SEPARATORS),
  ];

  const names = new Set();
  for (const candidate of candidates) {
    const name = candidate.trim();
    // 「スパイク...」のように元サイト側で省略された名前は、誰を指すか確定できないので使わない
    if (!name || name.includes('...') || name.includes('…')) continue;

    names.add(name);
    for (const separator of ['：', ':']) {
      if (name.includes(separator)) {
        const tail = name.slice(name.lastIndexOf(separator) + 1).trim();
        if (tail) names.add(tail);
      }
    }
  }
  return names;
}

// 出演者名 → 公演 の索引。以前は描画のたびに全公演(約2,100件)の出演者名を解析しており、
// それだけで1回22msかかっていた(実測)。インスタンスごとに一度だけ作れば以降は0.0004ms。
// events.json は再デプロイでしか変わらないので、索引が古くなることはない。
let livesByPerformer = null;

function livesOf(artistName) {
  if (!livesByPerformer) {
    livesByPerformer = new Map();
    const sorted = [...loadEvents()].sort((a, b) => a.live_date.localeCompare(b.live_date));
    for (const live of sorted) {
      for (const name of performerNames(live)) {
        if (!livesByPerformer.has(name)) livesByPerformer.set(name, []);
        livesByPerformer.get(name).push(live);
      }
    }
  }
  return livesByPerformer.get(artistName) || [];
}

// artist_profiles の description は、3,582件中2,912件が「現在調査中です」の
// プレースホルダーのまま(2026-09-26時点)。中身が無いまま「紹介・見どころ」の枠だけ
// 出すと、数千ページに同一の薄い重複コンテンツが並ぶことになるので表示しない。
// URL Inspection APIで抽出調査したところ、プレースホルダーを出しているページの
// インデックス率(25.5%)は、プロフィールが全く無いページ(37.5%)より低かった。
function usableDescription(description) {
  if (!description) return null;

  const text = description.trim();
  if (!text) return null;
  if (text.length <= 40 && text.includes('調査中')) return null;

  return text;
}

// SEO-PLAN.md P0-1: 芸人ごとに固有の1〜2行サマリーを作る。
// 出演予定がある/なしで文言を出し分ける(0件パターンはソフト404対策にもなる)。
function buildSummary(artistName, upcomingLives, stats) {
  const totalCount = stats?.total_count ?? upcomingLives.length;

  if (upcomingLives.length > 0) {
    const next = upcomingLives[0];
    return `${artistName}の次回出演は${formatShortDateWithWeekday(next.live_date)}${displayVenue(next.venue)}。今後の予定${upcomingLives.length}件、過去を含めて${totalCount}件を掲載しています。`;
  }

  if (stats?.last_appearance) {
    return `${artistName}の今後の出演予定は現在掲載がありません。直近の出演は${formatFullDate(stats.last_appearance.date)}${displayVenue(stats.last_appearance.venue) ? `（${displayVenue(stats.last_appearance.venue)}）` : ''}でした。過去を含めて${totalCount}件を掲載しています。`;
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

  // ▼ ① Supabaseから芸人の紹介文を取得
  // egress超過でAPIがブロックされている間は失敗しうるので、落とさず握りつぶす
  // (afi_link は amazonProducts.js に移したのでもう読まない)
  let profileData = null;
  try {
    const { data } = await supabase
      .from('artist_profiles')
      .select('description')
      .eq('name', artistName)
      .single();
    profileData = data;
  } catch (err) {
    console.error('Supabase error (artist_profiles):', err);
  }

  // ② ライブ一覧は静的スナップショット(events.json)から、出演者名の索引で引く
  const today = new Date().toISOString().split('T')[0];
  const filteredLives = livesOf(artistName).filter(live => live.live_date >= today);

  // ③ 過去の出演履歴・よく出演する会場・よく共演する芸人はスクレイパー側で事前集計した静的JSONから取得
  const stats = loadArtistStats()[artistName];
  const description = usableDescription(profileData?.description);
  const products = productsFor(artistName);
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

        {/* ▼ 紹介文と関連作品は1つの枠にまとめる。別枠にすると広告然として浮くため。
            ただし景品表示法(ステマ規制)は「広告だと分かりにくいこと」自体を問題に
            するので、見た目を馴染ませる代わりに「広告」ラベルと区切り線は必ず残す。 */}
        {(description || products.length > 0) && (
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-8">
            {description && (
              <>
                <h3 className="font-bold text-gray-800 mb-2 border-b pb-2">
                  {artistName}の紹介・見どころ
                </h3>

                {/* whitespace-pre-wrapをつけているので、AIが作った改行も正しく表示されます */}
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {description}
                </p>
              </>
            )}

            {/* 商品が確認できている芸人のみ、具体的な作品名で表示する(最大2件)
                商品画像はSiteStripeの画像リンク廃止(2024-01)によりPA-APIが必須で、
                PA-APIは直近180日に3件の適格販売が要るため現状使えない。
                代わりに種別アイコン・カード化・行ごとのCTAで視認性を出している。 */}
            {products.length > 0 && (
              <div className={description ? 'mt-6 pt-5 border-t border-gray-100' : ''}>
                <h3 className="font-bold text-gray-800 mb-3 text-sm">
                  {artistName}の関連作品
                  <span className="ml-2 text-[10px] font-normal text-gray-400 align-middle">広告</span>
                </h3>

                <ul className="space-y-3">
                  {products.map(product => {
                    const style = KIND_STYLES[product.kind] || KIND_STYLES.default;
                    return (
                      <li key={product.asin}>
                        <a
                          href={amazonUrl(product.asin)}
                          target="_blank"
                          rel="sponsored noopener noreferrer"
                          className="group flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:border-orange-300 hover:bg-orange-50"
                        >
                          <span
                            className={`shrink-0 w-14 h-14 rounded-md border flex flex-col items-center justify-center ${style.box}`}
                          >
                            <span className="text-xl leading-none">{style.icon}</span>
                            <span className="mt-1 text-[10px] font-bold">{product.kind}</span>
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-gray-800 group-hover:text-orange-800">
                              {product.title}
                            </span>
                            <span className="mt-1 inline-block text-xs font-bold text-orange-600">
                              Amazonで見る →
                            </span>
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>

                <p className="text-[10px] text-gray-400 mt-3">
                  ※Amazonのアソシエイトとして、当サイトは適格販売により収入を得ています。
                  価格・在庫はリンク先でご確認ください。
                </p>
              </div>
            )}
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
                  {[displayVenue(live.venue), live.title].filter(Boolean).join(' - ')}
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
                      {[displayVenue(live.venue), live.title].filter(Boolean).join(' - ')}
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
