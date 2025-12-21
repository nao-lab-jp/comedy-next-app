import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

// ▼ 環境変数 (セキュリティのため本番では必ず環境変数をご利用ください) ▼
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aqtvkwtcjjegbmmsdyjn.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxdHZrd3RjamplZ2JtbXNkeWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MTQwODMsImV4cCI6MjA3OTQ5MDA4M30.dI5rMh18TyUsVbPLA4qIDa-ccnFPppoGDz7LJNhqOpU'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// 手順1で作った関数の戻り値の型定義
type PerformerResult = {
  performer_name: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://owarai-live.com'

  // Supabaseの関数(RPC)を呼び出して、重複なしのリストを取得
  const { data: performers, error } = await supabase
    .rpc('get_unique_performers')

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

  // サイトマップ生成
  const artistUrls: MetadataRoute.Sitemap = (performers as PerformerResult[]).map((p) => {
    // ★修正ポイント: encodeURIComponent で日本語や記号を安全な文字コードに変換
    // これにより "EntityRef: expecting ';'" エラーが解消されます
    return {
      url: `${baseUrl}/artist/${encodeURIComponent(p.performer_name)}`, 
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }
  })

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