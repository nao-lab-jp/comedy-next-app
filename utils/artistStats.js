import fs from 'fs'
import path from 'path'

// SEO-PLAN.md P0-1: スクレイパー実行時に生成された芸人別集計データ(過去の出演履歴・
// よく出演する会場・よく共演する芸人)を読む。events.jsonと同じく静的JSON参照でegressを避ける。
//
// このJSONは12MBを超えており、読み直すたびに約180msのCPUを使う。芸人ページは
// generateMetadata とページ本体の2回呼ぶので、キャッシュしないと1リクエストで360msかかる。
// Vercelの無料枠(Fluid Active CPU 4時間)を使い切る主因になっていたため、プロセス内に保持する。
//
// 中身が変わるのはスクレイパーがGitHubにpushしたときだけで、その度にVercelが再デプロイして
// 新しいインスタンスになるため、キャッシュが古いまま残ることはない。
let cached = null

export function loadArtistStats() {
  if (cached) return cached

  const filePath = path.join(process.cwd(), 'public', 'artist-stats.json')
  try {
    cached = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    return cached
  } catch {
    // 読めなかった場合はキャッシュしない(次回の呼び出しでやり直せるようにする)
    return {}
  }
}
