import { createClient } from '@supabase/supabase-js';
import SearchForm from '@/components/SearchForm';

// 1. Supabaseクライアントの初期化
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 動的レンダリングを強制（検索結果を常に最新にするため）
export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TennisTipsPage({ searchParams }: Props) {
  // 2. 検索パラメータの取得
  const sParams = await searchParams;
  const q = typeof sParams.q === 'string' ? sParams.q : undefined;
  const level = typeof sParams.level === 'string' ? sParams.level : undefined;
  const category = typeof sParams.category === 'string' ? sParams.category : undefined;

  // 3. Supabase クエリ構築
  let query = supabase
    .from('tennis_tips')
    .select('*', { count: 'exact' });

  // 4. UIの分岐に合わせた検索ロジック
  // キーワード(q)がある場合はキーワード検索を優先、ない場合は条件検索を適用
  if (q) {
    query = query.or(`problem.ilike.%${q}%,hint.ilike.%${q}%`);
  } else {
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (level && level !== 'all') {
      query = query.eq('level', level);
    }
  }

  // ソートと取得範囲の設定（とりあえず最初の100件を表示）
  query = query.order('id', { ascending: true }).range(0, 99);

  const { data: tips, count, error } = await query;

  if (error) {
    console.error('Supabase error:', error);
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* ヘッダーセクション */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            テニス上達の知恵袋
          </h1>
          <p className="text-slate-600 text-lg">
            1,000件の課題解決リストから、あなたのテニスを劇的に変えるヒントを見つける
          </p>
        </header>

        {/* 検索・フィルタフォーム */}
        <div className="mb-12">
          <SearchForm initialParams={{ q, level, category }} />
        </div>

        {/* 検索結果のステータス表示 */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {q ? `「${q}」の検索結果` : 'ヒント一覧'}
          </h2>
          <div className="text-sm text-slate-500">
            該当件数: <span className="font-bold text-slate-900 text-lg">{count ?? 0}</span> 件
          </div>
        </div>

        {/* メインの結果表示（カード形式） */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips?.map((tip) => (
            <article 
              key={tip.id} 
              className="flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md font-bold ${
                  tip.level === '初級' ? 'bg-emerald-100 text-emerald-700' :
                  tip.level === '中級' ? 'bg-sky-100 text-sky-700' : 'bg-violet-100 text-violet-700'
                }`}>
                  {tip.level}
                </span>
                <span className="text-[10px] uppercase tracking-widest bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-bold">
                  {tip.category}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-4 leading-snug">
                <span className="text-blue-600 mr-2">Q.</span>
                {tip.problem}
              </h3>
              
              <div className="mt-auto pt-5 border-t border-slate-50">
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                  <span className="font-bold text-amber-500 block mb-1 text-xs">💡 ADVICE</span>
                  {tip.hint}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* 0件ヒット時の表示 */}
        {tips?.length === 0 && (
          <div className="text-center py-32 bg-white border border-dashed border-slate-300 rounded-3xl">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-slate-500 font-medium">条件に一致するヒントが見つかりませんでした。</p>
            <p className="text-slate-400 text-sm mt-2">キーワードを変えるか、別のカテゴリーを試してみてください。</p>
          </div>
        )}

        {/* フッター（件数が多い場合の注釈） */}
        {count && count > 100 && (
          <div className="mt-12 text-center text-slate-400 text-sm">
            表示されているのは最新の100件です。
          </div>
        )}
      </div>
    </div>
  );
}