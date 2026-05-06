import { createClient } from '@supabase/supabase-js';
import SearchForm from '@/components/SearchForm';

// Supabaseクライアントの初期化
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TennisTipsPage({ searchParams }: Props) {
  // Next.js 15以降のApp Routerの仕様に合わせて await を追加
  const sParams = await searchParams;
  const q = typeof sParams.q === 'string' ? sParams.q : undefined;
  const level = typeof sParams.level === 'string' ? sParams.level : undefined;
  const category = typeof sParams.category === 'string' ? sParams.category : undefined;

  // --- Supabase クエリ構築 ---
  let query = supabase
    .from('tennis_tips')
    .select('*', { count: 'exact' });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (level && level !== 'all') {
    query = query.eq('level', level);
  }

  if (q) {
    query = query.or(`problem.ilike.%${q}%,hint.ilike.%${q}%`);
  }

  query = query.order('id', { ascending: true }).range(0, 50);

  const { data: tips, count } = await query;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">テニス上達の知恵袋</h1>
        <p className="text-slate-600">1,000件の課題解決リストから自分に合ったヒントを探す</p>
      </header>

      <div className="mb-10">
        <SearchForm initialParams={{ q, level, category }} />
      </div>

      <div className="mb-4 text-sm text-slate-500">
        検索結果: <span className="font-bold text-slate-800">{count ?? 0}</span> 件
      </div>

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