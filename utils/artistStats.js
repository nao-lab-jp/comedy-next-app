import { cache } from 'react'
import { restGet } from './supabaseRest'

// 芸人ページ1枚分のデータ(過去の出演履歴・よく出演する会場・よく共演する芸人と、
// 今後の出演予定)。スクレイパーが artist_pages テーブルに芸人1組1行で書き込む
// (comedy-scraper/publish_site_data.py)。
//
// 以前は全芸人分の artist-stats.json(15MB)をデプロイに含めて読んでいたが、
// スクレイパーのpushによる再デプロイでISRキャッシュが全て捨てられ、ISR Writesの
// 無料枠を超えたため、データをデプロイから切り離した。描画時はその芸人の1行(数KB)だけ読む。
//
// generateMetadata とページ本体で同じ行を使うので、1回の描画につき1回だけ取りに行く。
export const loadArtistPage = cache(async (name) => {
  const rows = await restGet(
    `artist_pages?name=eq.${encodeURIComponent(name)}&select=data`
  )
  return rows[0]?.data ?? null
})

// sitemap.xml 用。出演実績が minCount 件以上の芸人名と最終更新日時
const PAGE_SIZE = 1000

export async function listArtistsForSitemap(minCount) {
  const artists = []
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const rows = await restGet(
      `artist_pages?select=name,last_updated_at&total_count=gte.${minCount}` +
      `&order=name.asc&limit=${PAGE_SIZE}&offset=${offset}`
    )
    artists.push(...rows)
    if (rows.length < PAGE_SIZE) return artists
  }
}
