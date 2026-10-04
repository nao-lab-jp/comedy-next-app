// 日付別(今日・明日・今週末)とエリア別ページへのリンク集。
// トップページと各一覧ページの両方に置き、ページ同士を相互にリンクさせる。
import Link from 'next/link';
import { AREAS } from '@/utils/area';

export const DATE_PAGES = [
  { href: '/today', label: '今日のライブ', icon: '🎤' },
  { href: '/tomorrow', label: '明日のライブ', icon: '🌙' },
  { href: '/weekend', label: '今週末(土日)', icon: '🎉' },
];

export default function BrowseLinks({ current = '' }) {
  return (
    <nav aria-label="日付・エリアから探す" className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8">
      <h2 className="text-lg font-bold text-gray-700 mb-3">📅 日付から探す</h2>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {DATE_PAGES.map(page => (
          <Link
            key={page.href}
            href={page.href}
            aria-current={current === page.href ? 'page' : undefined}
            className={`text-center py-3 px-2 rounded-lg font-bold text-sm transition ${
              current === page.href
                ? 'bg-red-500 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-100'
            }`}
          >
            <span className="block text-lg">{page.icon}</span>
            {page.label}
          </Link>
        ))}
      </div>

      <h2 className="text-lg font-bold text-gray-700 mb-3">📍 エリアから探す</h2>
      <div className="flex flex-wrap gap-2">
        {AREAS.map(area => {
          const href = `/area/${area.slug}`;
          return (
            <Link
              key={area.slug}
              href={href}
              aria-current={current === href ? 'page' : undefined}
              className={`text-sm py-1.5 px-3 rounded-full border transition ${
                current === href
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {area.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
