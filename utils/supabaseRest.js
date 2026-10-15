import https from 'https'
import zlib from 'zlib'

// サイト表示用データ(site_snapshots / artist_pages)をSupabaseのREST APIから読む。
//
// supabase-js(=fetch)を使わないのは、Next.jsがfetchを監視していて、キャッシュしない
// fetchを使ったページはISRに載らず毎回描画になるため。キャッシュするfetchにすると今度は
// VercelのData Cacheに載り、スクレイパーが更新した直後の再生成でも古い値が返ってしまう。
// node:https はNext.jsの管理外なので、ページのISR(revalidate)だけでキャッシュを制御できる。
//
// Supabaseのegressを抑えるため gzip で受け取る(公演一覧の1.5MBが約1/8になる)。
const TIMEOUT_MS = 10000

export function restGet(pathAndQuery) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!base || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY が未設定です')

  const url = new URL(`/rest/v1/${pathAndQuery}`, base)
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: 'application/json',
        'Accept-Encoding': 'gzip',
      },
      timeout: TIMEOUT_MS,
    }, res => {
      const chunks = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('error', reject)
      res.on('end', () => {
        try {
          let body = Buffer.concat(chunks)
          if (res.headers['content-encoding'] === 'gzip') body = zlib.gunzipSync(body)
          const text = body.toString('utf-8')
          if (res.statusCode !== 200) {
            reject(new Error(`Supabase REST ${res.statusCode}: ${text.slice(0, 200)}`))
            return
          }
          resolve(JSON.parse(text))
        } catch (err) {
          reject(err)
        }
      })
    })
    req.on('timeout', () => req.destroy(new Error(`Supabase REST timeout: ${url.pathname}`)))
    req.on('error', reject)
  })
}
