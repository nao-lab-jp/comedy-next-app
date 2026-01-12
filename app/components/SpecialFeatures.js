// app/components/SpecialFeatures.js
import Link from 'next/link';

export default function SpecialFeatures() {
  // ここに表示したい特集と芸人リストを定義します
  const features = [
    {
      title: '🏆 2025 M-1グランプリ 決勝進出',
      color: 'bg-yellow-50 border-yellow-200',
      icon: '🔥',
      artists: [
        'たくろう', 'ヤーレンズ', '真空ジェシカ', 'エバース', 
        'カナメストーン', '豪快キャプテン', 'ドンデコルテ', 'ママタルト',
        'めぞん', 'ヨネダ2000' // ※2025年の実際のメンバーに書き換えてください
      ]
    },
    {
      title: '👑 2025 キングオブコント 決勝進出',
      color: 'bg-blue-50 border-blue-200',
      icon: '🎭',
      artists: [
        'ロングコートダディ', '青色1号', 'うるとらブギーズ', '元祖いちごちゃん',
        'しずる', 'トム・ブラウン', 'ファイヤーサンダー', 'ベルナルド',
        'や団', 'レインボー' // ※実際のメンバーに書き換えてください
      ]
    }
  ];

  return (
    <div className="space-y-6 mb-12">
      {features.map((feature, index) => (
        <div key={index} className={`p-4 rounded-lg border ${feature.color}`}>
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>{feature.icon}</span>
            {feature.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {feature.artists.map((artist) => (
              <Link 
                key={artist}
                // 検索機能と連動させるため、クエリパラメータを渡す（SearchPanelの実装によります）
                // または単純にその芸人のページがあれば `/artists/${artist}` でもOK
                href={`/?q=${encodeURIComponent(artist)}`} 
                className="bg-white hover:bg-gray-100 text-gray-700 text-sm py-1.5 px-3 rounded-full border border-gray-200 transition-colors shadow-sm"
              >
                {artist}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}