import { restGet } from './supabaseRest'

// 今後の公演一覧(スクレイパーが site_snapshots テーブルの key='events' に書き込む)。
//
// 2026-10-15まではスクレイパーが public/events.json をpushして再デプロイしていたが、
// 再デプロイのたびにISRキャッシュが全て捨てられ、ISR Writesの無料枠を超えたため
// データをデプロイから切り離した(comedy-scraper/publish_site_data.py 参照)。
//
// 本体は約1.5MBあるので、プロセス内に保持して版(version)が変わった時だけ読み直す。
// 版の確認は毎回行う(数十バイト)。スクレイパーは書き込み後に再生成を依頼するので、
// ここで古い版を返すとその古い内容がキャッシュされてしまうため。
let cached = { version: null, events: null }
let loading = null

async function fetchLatest() {
  const [head] = await restGet('site_snapshots?key=eq.events&select=version')
  if (!head) throw new Error('site_snapshots に events がありません')
  if (cached.events && cached.version === head.version) return cached.events

  const [row] = await restGet('site_snapshots?key=eq.events&select=version,body')
  cached = { version: row.version, events: row.body }
  return cached.events
}

export async function loadEvents() {
  // 同時に描画されたページで本体を重複して取りに行かない
  if (!loading) loading = fetchLatest().finally(() => { loading = null })
  try {
    return await loading
  } catch (err) {
    // Supabaseに繋がらない間は手元の版で描く。手元にも無ければエラーにして、
    // VercelがISRの古いページを出し続けるようにする(空の一覧をキャッシュさせない)
    if (cached.events) {
      console.error('公演一覧の取得に失敗したため、保持している版で描画します:', err)
      return cached.events
    }
    throw err
  }
}
