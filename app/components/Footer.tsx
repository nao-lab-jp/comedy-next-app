import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8 mt-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-gray-600 mb-8">
          {/* ▼ トップページへのリンクを追加 */}
          <Link href="/" className="hover:text-yellow-600 hover:underline transition-colors font-medium">
            トップページ
          </Link>
          
          <Link href="/privacy" className="hover:text-yellow-600 hover:underline transition-colors">
            プライバシーポリシー
          </Link>
          
          <Link href="/terms" className="hover:text-yellow-600 hover:underline transition-colors">
            利用規約・免責事項
          </Link>
          
          <Link href="/contact" className="hover:text-yellow-600 hover:underline transition-colors">
            お問い合わせ
          </Link>
        </div>
        
        <div className="text-center">
          {/* ハイドレーションエラー対策として suppressHydrationWarning を付与 */}
          <p className="text-xs text-gray-400" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} 東京お笑いライブ検索 (owarai-live.com)
          </p>
        </div>
      </div>
    </footer>
  );
}