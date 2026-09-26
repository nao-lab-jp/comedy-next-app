import { MetadataRoute } from 'next'
import { loadArtistStats } from '@/utils/artistStats'

// SEO-PLAN.md P0-3: sitemap.xml の自動生成
// 以前はSupabaseのRPCをリクエスト毎に呼んでいたが、egressブロックで失敗し
// トップページ1件しか出力されない状態になっていた。P0-1で導入した静的スナップショット
// (artist-stats.json、スクレイパー実行時に事前生成)を読むだけにして、DBアクセスを無くす。
//
// 注意: generateSitemaps() で複数ファイルに分割すると配信URLが /sitemap/[id].xml に変わり、
// 既存の robots.txt の `Sitemap: https://owarai-live.com/sitemap.xml` 宣言と合わなくなる。
// 現状の芸人数はSitemapプロトコルの上限(50,000件/ファイル)に対して十分小さいため、
// 単一ファイルのまま返す。上限に近づいたら分割方式(と robots.txt)を見直すこと。
const baseUrl = 'https://owarai-live.com'

// 2026-09-26、URL Inspection APIで200ページを抽出して調べたところ、
// sitemapの5,041URLのうち約58%はGoogleが一度もクロールしていなかった
// (「検出 - インデックス未登録」50.5% +「URLが認識されていません」7.0%、いずれも最終クロール日なし)。
// 中身を読んだ上で見送られた「クロール済み - インデックス未登録」は9%しかなく、
// ボトルネックはページの質ではなくクロール予算側にある。
//
// 出演実績が1件だけの芸人は2,114件(全体の42%)あり、ここには出演者名の分割ミスで
// 生まれた断片(例: "The"、"World-")が多く混ざる。sitemapで宣伝する対象から外し、
// 実績のあるページにクロールを寄せる。
// 注意: sitemapから外すだけで、ページ自体は残るしnoindexにもしない(既にインデックス
// されているものは維持される)。効果を見てこの閾値を引き上げる余地はある。
const MIN_APPEARANCES = 2

const STATIC_PAGES: {
  path: string
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>
  priority: number
}[] = [
  { path: '', changeFrequency: 'daily', priority: 1 },
  { path: '/guide', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
]

type ArtistStats = Record<string, { last_updated_at?: string | null; total_count?: number }>

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const stats = loadArtistStats() as ArtistStats

  const artistEntries: MetadataRoute.Sitemap = Object.entries(stats)
    .filter(([, data]) => (data?.total_count ?? 0) >= MIN_APPEARANCES)
    .map(([name, data]) => ({
      url: `${baseUrl}/artist/${encodeURIComponent(name)}`,
      lastModified: data?.last_updated_at ? new Date(data.last_updated_at) : undefined,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: `${baseUrl}${p.path}`,
    lastModified: new Date(),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }))

  return [...staticEntries, ...artistEntries]
}
