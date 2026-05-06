'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchForm({ initialParams }: { initialParams: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialParams.q ? 'keyword' : 'filter');

  // ステート管理
  const [q, setQ] = useState(initialParams.q || '');
  const [level, setLevel] = useState(initialParams.level || 'all');
  const [category, setCategory] = useState(initialParams.category || 'all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (activeTab === 'keyword') {
      if (q) params.set('q', q);
      // キーワード検索時は他のフィルタをリセットする場合
    } else {
      if (level !== 'all') params.set('level', level);
      if (category !== 'all') params.set('category', category);
    }
    
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* タブ切り替え部分 */}
      <div className="flex border-b border-slate-100 bg-slate-50/50">
        <button
          onClick={() => setActiveTab('keyword')}
          className={`flex-1 py-3 text-sm font-bold transition-colors ${
            activeTab === 'keyword' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          🔍 キーワードで探す
        </button>
        <button
          onClick={() => setActiveTab('filter')}
          className={`flex-1 py-3 text-sm font-bold transition-colors ${
            activeTab === 'filter' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          🎯 条件（レベル・種類）で絞り込む
        </button>
      </div>

      {/* フォーム本体 */}
      <form onSubmit={handleSearch} className="p-6">
        {activeTab === 'keyword' ? (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="例：サーブ、緊張、ダブルス..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95">
              検索
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">レベル</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none appearance-none"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="all">すべてのレベル</option>
                <option value="初級">初級</option>
                <option value="中級">中級</option>
                <option value="上級">上級</option>
              </select>
            </div>
            <div className="flex-[2]">
              <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">カテゴリー</label>
<select 
  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none appearance-none"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option value="all">すべてのカテゴリー</option>
  <optgroup label="技術・ショット">
    <option value="サービス">サービス</option>
    <option value="リターン">リターン</option>
    <option value="フォアハンド">フォアハンド</option>
    <option value="片手バック">片手バック</option>
    <option value="両手バック">両手バック</option>
    <option value="ネットプレー">ネットプレー</option>
  </optgroup>
  <optgroup label="戦略・メンタル・ケア">
    <option value="試合展開">試合展開</option>
    <option value="試合心構え">試合心構え</option>
    <option value="フィジカルケア">フィジカルケア</option> {/* ←追加しました */}
  </optgroup>
</select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold transition-all active:scale-95">
                この条件で表示
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}