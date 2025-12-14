import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://owarai-live.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // 将来的にはここに全芸人のページURLを自動生成して追加することも可能です
  ]
}