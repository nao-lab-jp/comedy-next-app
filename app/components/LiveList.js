'use client'

import { useState } from 'react'

export default function LiveList({ initialLives }) {
  // ※ここは、もしSearchPanel側でリスト表示も兼ねているなら不要ですが、
  // ClientPageContentから呼ばれる「ただのリスト表示部品」として機能させます。
  
  const lives = initialLives || [];

  return (
    <ul className="space-y-4">
      {lives.map((live) => (
        <li key={live.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold mb-2 text-blue-600">
              <a href={live.source_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {live.title}
              </a>
            </h2>
            <span className={`text-xs font-bold px-2 py-1 rounded ${
              live.ticket_status?.includes('売切') || live.ticket_status?.includes('終了') 
              ? 'bg-gray-200 text-gray-500' 
              : 'bg-green-100 text-green-800'
            }`}>
              {live.ticket_status || '販売中'}
            </span>
          </div>
          
          <div className="text-gray-700 space-y-1 mt-2">
            {/* ★ここを修正しました★ */}
            <p suppressHydrationWarning>
              📅 日時: {new Date(live.live_date).toLocaleString('ja-JP', {
                  year: 'numeric', month: 'numeric', day: 'numeric', 
                  hour: '2-digit', minute: '2-digit', weekday: 'short' 
              })}
            </p>
            <p>📍 会場: {live.venue}</p>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              出演: {Array.isArray(live.performers_clean) && live.performers_clean.length > 0
                ? live.performers_clean.map((name, i) => (
                    <span key={name}>
                      {i > 0 && ' / '}
                      <a href={`/artist/${encodeURIComponent(name)}`} className="text-blue-600 hover:underline">
                        {name}
                      </a>
                    </span>
                  ))
                : live.performers}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}