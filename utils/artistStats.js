import fs from 'fs'
import path from 'path'

// SEO-PLAN.md P0-1: スクレイパー実行時に生成された芸人別集計データ(過去の出演履歴・
// よく出演する会場・よく共演する芸人)を読む。events.jsonと同じく静的JSON参照でegressを避ける。
export function loadArtistStats() {
  const filePath = path.join(process.cwd(), 'public', 'artist-stats.json')
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}
