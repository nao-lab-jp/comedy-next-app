'use client'

import { useState } from 'react'
import SearchPanel from './SearchPanel'
// 以前作った LiveList がある前提です
// もし LiveList.js が components フォルダになければ、以前のコードから作成してください
import LiveList from './LiveList' 

export default function ClientPageContent({ initialLives, artistGroups }) {
  // 検索結果の状態管理
  const [filteredLives, setFilteredLives] = useState(initialLives);

  // 検索実行ロジック
  const handleSearch = (date, keyword) => {
    let results = initialLives;

    // 日付で絞り込み (前方一致: "2025-07-01")
    if (date) {
      results = results.filter(live => live.live_date && live.live_date.startsWith(date));
    }

    // キーワードで絞り込み
    if (keyword) {
      const k = keyword.toLowerCase();
      results = results.filter(live => {
        // タイトル、会場、出演者、そして「かな」も含めて検索対象にする
        const target = `
            ${live.title} 
            ${live.venue} 
            ${live.performers} 
            ${live.performers_kana ? JSON.stringify(live.performers_kana) : ''}
        `.toLowerCase();
        return target.includes(k);
      });
    }

    setFilteredLives(results);
  };

  return (
    <>
      {/* 検索パネルエリア */}
      <SearchPanel artistGroups={artistGroups} onSearch={handleSearch} />

      {/* 結果一覧表示エリア */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-700 border-l-4 border-red-500 pl-3">
          検索結果: {filteredLives.length} 件
        </h2>
        
        {/* LiveListコンポーネントに絞り込んだデータを渡す */}
        {/* ※SearchPanelにも検索機能がありますが、リスト表示機能は分離しています */}
        <div className="bg-white rounded-lg shadow-sm p-2">
            {/* LiveList自体に検索機能がついている場合、initialLivesではなく
                ここで絞り込んだ filteredLives を渡すように修正してください。
                LiveList.js が単純なリスト表示だけなら以下でOKです。 */}
            <LiveList initialLives={filteredLives} />
        </div>
      </div>
    </>
  );
}