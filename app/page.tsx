import { createClient } from '@supabase/supabase-js'; // 必要に応じて適切なパスに変更
import SearchForm from '@/components/SearchForm'; // 後述のコンポーネント

// Supabaseクライアントの初期化 (環境変数は適宜設定してください)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Props {
  searchParams: {
    q?: string;
    level?: string;
    category?: string;
  };
}

export default async function TennisTipsPage({ searchParams }: Props) {
  const { q, level, category } = searchParams;

  // --- Supabase クエリ構築 ---
  let query = supabase
    .from('tennis_tips') // テーブル名に合わせて変更してください
    .select('*', { count: 'exact' });

  // カテゴリ絞り込み
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  // レベル絞り込み
  if (level && level !== 'all') {
    query = query.eq('level', level);
  }

  // キーワード検索 (problem または hint に含まれる場合)
  if (q) {
    query = query.or(`problem.ilike.%${q}%,hint.ilike.%${q}%`);
  }

  // 最新順またはLevel順にソート（必要に応じて）
  query = query.order('id', { ascending: true }).range(0, 50); // 最初は50件表示

  const { data: tips, error, count } = await query;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">テニス上達の知恵袋</h1>
        <p className="text-slate-600">1,000件の課題解決リストから自分に合ったヒントを探す</p>
      </header>

      {/* 検索・フィルタフォーム (Client Component) */}
      <div className="mb-10">
        <SearchForm initialParams={{ q, level, category }} />
      </div>

      {/* 結果表示件数 */}
      <div className="mb-4 text-sm text-slate-500">
        検索結果: <span className="font-bold text-slate-800">{count ?? 0}</span> 件
      </div>

      {/* カード形式のリスト */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips?.map((tip) => (
          <div key={tip.id} className="flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                tip.level === '初級' ? 'bg-green-100 text-green-700' :
                tip.level === '中級' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {tip.level}
              </span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                {tip.category}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-3 leading-tight">
              <span className="text-red-500 mr-1">Q.</span>{tip.problem}
            </h3>
            
            <div className="mt-auto pt-4 border-t border-slate-50">
              <p className="text-slate-600 text-sm leading-relaxed">
                <span className="font-bold text-blue-600 block mb-1">Hint:</span>
                {tip.hint}
              </p>
            </div>
          </div>
        ))}
      </div>

      {tips?.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-xl">
          <p className="text-slate-500">条件に一致するヒントが見つかりませんでした。</p>
        </div>
      )}
    </div>
  );
}
}