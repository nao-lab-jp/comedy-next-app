import fs from 'fs'
import path from 'path'

// Supabase egress超過に伴う緊急措置: DBから生成した静的スナップショットを読む
export function loadEvents() {
  const filePath = path.join(process.cwd(), 'public', 'events.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
}
