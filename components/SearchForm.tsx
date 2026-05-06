'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SearchForm({ initialParams }: { initialParams: any }) {
  const router = useRouter();
  
  // 初期タブの決定：キーワードがあればキーワードタブ、なければ条件絞り込みタブ
  const [activeTab, setActiveTab] = useState(initialParams.q ? 'keyword' : 'filter');

  // 入力値の状態管理
  const [q, setQ] = useState(initialParams.q || '');
  const [level, setLevel] = useState(initialParams.level || 'all');
  const [category, setCategory] = useState(initialParams.category || 'all');

  // URLパラメータとフォームの値を同期（ブラウザの戻るボタン対策）
  useEffect(() => {
    setQ(initialParams.q || '');
    setLevel(initialParams.level || 'all');
    setCategory(initialParams.category || 'all');
  }, [initialParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (activeTab === 'keyword') {
      // キーワード検索モード
      if (q) params.set('q', q);
    } else {
      // 条件絞り込みモード
      if (level !== 'all') params.set('level', level);
      if (category !== 'all') params.set('category', category);
    }
    
    const queryString = params.toString();
    const targetUrl = `?${queryString}`;

    // 【重要】router.pushではなくwindow.location.hrefを使うことで
    // ブラウザにページ全体を再読み込みさせ、確実に最新の検索結果を表示させます。
    window.location.href = targetUrl;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* タブ切り替え */}
      <div className="flex border-b border-slate-100 bg-slate-50/50">
        <button
          type="button"
          onClick={() => setActiveTab('keyword')}
          className={`flex-1 py-4 text-sm font-bold transition-all ${
            activeTab === 'keyword' 
              ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          🔍 キーワードで探す
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('filter')}
          className={`flex-1 py-4 text-sm font-bold transition-all ${
            activeTab === 'filter' 
              ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          🎯 条件で絞り込む
        </button>
      </div>

      {/* フォーム部分 */}
      <form onSubmit={handleSearch} className="p-6">
        {activeTab === 'keyword' ? (
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="例：サーブ、緊張、ダブルス..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-100"
            >
              検索する
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 mb-1.5 ml-1 uppercase">Level</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none cursor-pointer"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="all">すべてのレベル</option>
                <option value="初級">初級</option>
                <option value="中級">中級</option>
                <option value="上級">上級</option>
              </select>
            </div>
            <div className="flex-[1.5]">
              <label className="block text-xs font-bold text-slate-400 mb-1.5 ml-1 uppercase">Category</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none cursor-pointer"
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
                  <option value="フィジカルケア">フィジカルケア</option>
                </optgroup>
              </select>
            </div>
            <div className="flex items-end">
              <button 
                type="submit" 
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-100"
              >
                この条件で絞り込む
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}