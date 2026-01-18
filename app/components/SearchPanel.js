'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchPanel({ artistGroups }) {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [keyword, setKeyword] = useState('');
  const [activeTab, setActiveTab] = useState('あ行');

  // 検索ボタンを押したときの処理
  const handleSearchClick = () => {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    
    // パラメータ名を 'q' に統一
    if (keyword) params.set('q', keyword); 

    router.push(`/search?${params.toString()}`);
  };

  const handleArtistClick = (name) => {
    router.push(`/artist/${encodeURIComponent(name)}`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      
      {/* 検索実行ボタン */}
      <button 
        onClick={handleSearchClick}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-4 rounded-lg shadow-md transition mb-8 flex justify-center items-center gap-2 transform hover:scale-[1.01]"
      >
        この条件で検索する 🚀
      </button>

      {/* 日付入力 */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-700 mb-2">📅 日付で探す</h3>
        <input 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-200 transition text-gray-800"
        />
      </div>

      {/* キーワード入力 */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-700 mb-2">🔍 キーワードで探す</h3>
        <input 
          type="text" 
          placeholder="コンビ名、会場名、ライブ名など..." 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
          className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-200 transition text-gray-800"
        />
      </div>

      <hr className="border-gray-100 mb-8" />

      {/* 芸人タブ */}
      <div>
        <h3 className="text-lg font-bold text-gray-700 mb-1">🎤 芸人名から探す</h3>
        <p className="text-xs text-gray-400 mb-4">※クリックするとその芸人のページへ移動します</p>

        <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200 pb-2">
          {Object.keys(artistGroups).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-sm rounded-full transition font-medium ${
                activeTab === tab ? 'bg-gray-800 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
          {artistGroups[activeTab]?.length > 0 ? (
            // ▼▼▼ ここを修正しました ▼▼▼
            // artist は { name: "...", kana: "..." } というオブジェクトなので、
            // artist.name で名前を取り出す必要があります。
            artistGroups[activeTab].map((artist) => (
              <button
                key={artist.name}
                onClick={() => handleArtistClick(artist.name)}
                className="text-left text-sm p-2 hover:bg-blue-50 text-blue-600 rounded transition truncate border border-transparent hover:border-blue-100"
              >
                {artist.name}
              </button>
            ))
            // ▲▲▲ 修正終わり ▲▲▲
          ) : (
            <p className="text-gray-400 text-sm col-span-3 py-4 text-center">該当する芸人がいません</p>
          )}
        </div>
      </div>
    </div>
  );
}