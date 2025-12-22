// app/contact/page.tsx
import React from 'react';

export const metadata = {
  title: 'お問い合わせ | 東京お笑いライブ検索',
};

export default function Contact() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-center">
      <h1 className="text-3xl font-bold mb-6">お問い合わせ</h1>
      <p className="mb-8 text-gray-600">
        当サイトに関するご意見・ご質問、掲載内容の誤り等につきましては、
        以下のGoogleフォームよりご連絡をお願いいたします。
      </p>
      
      <a 
        href="https://forms.gle/rUWMZjn7T7ijXPVi6" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-full transition-colors shadow-md"
      >
        お問い合わせフォームを開く（外部サイト）
      </a>

      <p className="mt-8 text-sm text-gray-500">
        ※返信には数日お時間をいただく場合がございます。あらかじめご了承ください。
      </p>
    </main>
  );
}