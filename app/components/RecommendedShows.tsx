import React from 'react';

// 1. ライブデータの形式（型）を定義する
interface Show {
  id: string | number;
  live_date: string;
  title: string;
  venue: string;
  performers: string;
  source_url: string;
}

// 2. プロップス（受け取る引数）の型を定義する
interface RecommendedShowsProps {
  shows: Show[];
}

export const RecommendedShows: React.FC<RecommendedShowsProps> = ({ shows }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {shows.map((show) => (
        <div key={show.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
          <div className="text-sm text-gray-500 mb-1">
            {/* 日付部分だけを表示 */}
            {show.live_date ? show.live_date.split(' ')[0] : ''}
          </div>
          <h3 className="font-bold text-blue-600 mb-2 line-clamp-2">{show.title}</h3>
          <div className="text-sm text-gray-700 mb-2">会場: {show.venue}</div>
          <div className="text-xs text-gray-500 line-clamp-2">
            出演: {show.performers}
          </div>
          <a 
            href={show.source_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-3 inline-block text-xs bg-yellow-400 font-bold py-1 px-3 rounded hover:bg-yellow-500"
          >
            チケット詳細へ
          </a>
        </div>
      ))}
    </div>
  );
};