'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SearchForm({ initialParams }: { initialParams: any }) {
  const router = useRouter();
  
  // 初期値をステートにセット
  const [q, setQ] = useState(initialParams.q || '');
  const [level, setLevel] = useState(initialParams.level || 'all');
  const [category, setCategory] = useState(initialParams.category || 'all');

  // URLのパラメータが直接書き換えられた場合にステートを同期させる（ブラウザの戻るボタン対策）
  useEffect(() => {
    setQ(initialParams.q || '');
    setLevel(initialParams.level || 'all');
    setCategory(initialParams.category || 'all');
  }, [initialParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🔍 デバッグ用ログ（ブラウザのコンソールで確認できます）
    console.log("検索実行:", { q, level, category });

    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (level && level !== 'all') params.set('level', level);
    if (category && category !== 'all') params.set('category', category);
    
    const queryString = params.toString();
    const targetUrl = `?${queryString}`;

    console.log("移動先URL:", targetUrl);

    // 確実に画面を更新させるために router.push を実行
    // それでも動かない場合は window.location.href = targetUrl; に書き換えると強制遷移します
    router.push(targetUrl);
  };

  return (
    <form onSubmit={handleSearch} className="bg-slate-50 p-6 rounded-2xl flex flex-col md:flex-row gap-4 shadow-inner">
      <div className="flex-1">
        <input
          type="text"
          placeholder="キーワードで検索 (例: サーブ, 緊張...)"
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-800"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <select 
          className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm outline-none text-slate-800"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="all">すべてのレベル</option>
          <option value="初級">初級</option>
          <option value="中級">中級</option>
          <option value="上級">上級</option>
        </select>
        <select 
          className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm outline-none text-slate-800"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">すべてのカテゴリ</option>
          <option value="サービス">サービス</option>
          <option value="リターン">リターン</option>
          <option value="試合心構え">試合心構え</option>
        </select>
        <button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors active:scale-95"
        >
          検索
        </button>
      </div>
    </form>
  );
}