'use client'; // これが重要です！

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchForm({ initialParams }: { initialParams: any }) {
  const router = useRouter();
  const [q, setQ] = useState(initialParams.q || '');
  const [level, setLevel] = useState(initialParams.level || 'all');
  const [category, setCategory] = useState(initialParams.category || 'all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (level !== 'all') params.set('level', level);
    if (category !== 'all') params.set('category', category);
    
    // URLを更新する（例: /?q=サーブ&level=初級）
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-slate-50 p-6 rounded-2xl flex flex-col md:flex-row gap-4 shadow-inner">
      <div className="flex-1">
        <input
          type="text"
          placeholder="キーワードで検索 (例: サーブ, 緊張...)"
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <select 
          className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm outline-none"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="all">すべてのレベル</option>
          <option value="初級">初級</option>
          <option value="中級">中級</option>
          <option value="上級">上級</option>
        </select>
        <select 
          className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">すべてのカテゴリ</option>
          <option value="サービス">サービス</option>
          <option value="リターン">リターン</option>
          <option value="試合心構え">試合心構え</option>
        </select>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          検索
        </button>
      </div>
    </form>
  );
}