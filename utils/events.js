import fs from 'fs'
import path from 'path'

// Supabase egress超過に伴う緊急措置: DBから生成した静的スナップショットを読む
//
// artist-stats.json と同じ理由でプロセス内にキャッシュする(こちらは1.1MBで約20ms)。
// 更新はスクレイパーのpush起点の再デプロイ時のみ。
let cached = null

export function loadEvents() {
  if (cached) return cached

  const filePath = path.join(process.cwd(), 'public', 'events.json')
  cached = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  return cached
}
