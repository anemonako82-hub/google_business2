'use client';

import React, { useState } from 'react';

export default function GbpPostForm() {
  const [image, setImage] = useState<File | null>(null);
  const [keywords, setKeywords] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert('カクテルの写真を選択してください。');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('AI文章生成＆Googleマイビジネスへ送信中...');

    // 写真とテキストを1つの塊（FormData）にパックする（これがバラバラ防止の鍵です）
    const formData = new FormData();
    formData.append('image', image);
    formData.append('keywords', keywords);
    formData.append('notes', notes);

    try {
      // 外部への直接通信によるCORSエラーを防ぐため、自前のAPI Routesを経由させます
      const response = await fetch('/api/gbp-post', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatusMessage('🚀 送信完了しました！Googleマップをご確認ください。');
        setKeywords('');
        setNotes('');
        setImage(null);
      } else {
        const errorData = await response.json();
        setStatusMessage(`❌ エラーが発生しました: ${errorData.message || '送信失敗'}`);
      }
    } catch (error) {
      setStatusMessage('❌ 通信エラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100 my-8">
      <h1 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        🍸 GBP自動投稿・AI文章構築
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 📸 写真選択 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">カクテル写真 *</label>
          <input
            type="file"
            accept="image/*"
            capture="environment" /* スマホでカメラを直接起動しやすくする属性 */
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            required
          />
        </div>

        {/* 🔑 キーワード入力 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">主要キーワード</label>
          <input
            type="text"
            placeholder="例: ラベンダー、自家製ジン、初夏の爽快感"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
          />
        </div>

        {/* 📝 メモ・補足事項 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">AIへの補足（気分や連絡事項）</label>
          <textarea
            placeholder="例: 金曜日の夜にそっと寄り添う癒やしの一杯。ハッシュタグは #bar #mixology で。"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
          />
        </div>

        {/* 🚀 送信ボタン */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2.5 px-4 rounded-md text-white font-medium shadow-sm transition-colors ${
            isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isSubmitting ? '処理中...' : 'AI文章生成 ➔ 投稿を実行'}
        </button>
      </form>

      {statusMessage && (
        <div className={`mt-4 p-3 rounded-md text-sm font-medium ${statusMessage.startsWith('❌') ? 'bg-red-50 text-red-700' : 'bg-indigo-50 text-indigo-800'}`}>
          {statusMessage}
        </div>
      )}
    </div>
  );
}