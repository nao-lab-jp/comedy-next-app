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

type ArtistStats = Record<string, { last_updated_at?: string | null }>

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const stats = loadArtistStats() as ArtistStats

  const artistEntries: MetadataRoute.Sitemap = Object.entries(stats).map(([name, data]) => ({
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
