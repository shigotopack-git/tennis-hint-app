import { createClient } from '@/utils/supabase/server';

export const revalidate = 0;

export default async function Page() {
  // 【重要】ここで await を入れることで、supabaseクライアントが準備できるのを待ちます
  const supabase = await createClient();

  // データを取得
  const { data: quotes, error } = await supabase
    .from('quotes')
    .select('*');

  if (error || !quotes) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-red-500 font-bold">データの取得に失敗しました。</p>
      </div>
    );
  }

// 1. 全データから著者（author）を重複なく取り出し、シャッフルして3名選ぶ
  const selectedAuthors = Array.from(new Set(quotes.map(q => q.author)))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // 2. 選ばれた3名それぞれから、ランダムに1つずつ名言を抽出する
  const displayQuotes = selectedAuthors.map(authorName => {
    const authorQuotes = quotes.filter(q => q.author === authorName);
    return authorQuotes[Math.floor(Math.random() * authorQuotes.length)];
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900">偉人からの伝言</h1>
          <p className="mt-2 text-slate-600">未来を作りたいあなたにとって気づきになる言葉</p>
        </div>

        <div className="grid gap-6">
          {displayQuotes.map((quote) => (
            <div 
              key={quote.id} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200"
            >
              <p className="text-xl leading-relaxed text-slate-800 font-medium mb-4">
                「{quote.content}」
              </p>
              <p className="text-right text-slate-500 font-bold">
                — {quote.author}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            別の言葉を仰ぐ
          </a>
        </div>
      </div>
    </main>
  );
}