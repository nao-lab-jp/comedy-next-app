import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

// ▼ 環境変数から読み込むのがベストですが、以前の設定に合わせています ▼
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aqtvkwtcjjegbmmsdyjn.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxdHZrd3RjamplZ2JtbXNkeWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MTQwODMsImV4cCI6MjA3OTQ5MDA4M30.dI5rMh18TyUsVbPLA4qIDa-ccnFPppoGDz7LJNhqOpU'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ★修正1: URLにはIDではなく「芸人名」を使ったほうがSEOに強いです
type Performer = {
  name: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://owarai-live.com'

  // ★修正2: テーブル名は 'artists' ではなく 'performers' ではありませんか？
  // これまでスクレイピングしたデータを 'performers' カラムやテーブルに入れているはずです。
  // ここでは「芸人マスタテーブル」的なものから全芸人名を取ってくる想定です。
  const { data: performers, error } = await supabase
    .from('performers') // ← あなたのDBのテーブル名を確認してください！
    .select('name')     // ← URLに使うカラム（芸人名）を取得

  if (error || !performers) {
    console.error('Supabase fetch error:', error)
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ]
  }

  // 重複を削除（もしDBに重複がある場合）
  const uniquePerformers = Array.from(new Set(performers.map(p => p.name)))

  // サイトマップ生成
  const artistUrls: MetadataRoute.Sitemap = uniquePerformers.map((name) => ({
    // ★修正3: URLを日本語（芸人名）にします
    // 例: https://owarai-live.com/artist/ダウンタウン
    // encodeURIComponentはNext.jsが自動処理しますが、念の為ブラウザが解釈しやすい形にします
    url: `${baseUrl}/artist/${name}`, 
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...artistUrls,
  ]
}