'use client';

import { useState } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText || isLoading) return;

    // 1. 自分のメッセージを画面に追加
    const newUserMessage = { role: 'user', content: inputText };
    setMessages((prev) => [...prev, newUserMessage]);
    
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      // 2. APIに送信
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, newUserMessage] }),
      });

      if (!response.ok) {
        throw new Error(`通信エラー: ${response.status}`);
      }

      // 3. レスポンスをテキストとして一旦受け取る（エラー回避のため）
      const responseText = await response.text();
      
      if (!responseText) {
        throw new Error('サーバーからの返信が空でした');
      }

      // 4. JSONとして解析
      const data = JSON.parse(responseText);
      
      // 5. AIのメッセージを画面に追加
      if (data.text) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.text }]);
      } else {
        throw new Error('返信データの形式が正しくありません');
      }

    } catch (error) {
      console.error("Chat Error:", error);
      alert("コーチとの通信に失敗しました。APIキーの設定や、サーバーのターミナルを確認してください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col h-screen bg-gray-50 text-black font-sans">
      <header className="py-4 border-b bg-white px-4 -mx-4 mb-4 shadow-sm">
        <h1 className="text-xl font-bold text-center text-blue-800">テニス上達・AI相談室</h1>
        <p className="text-xs text-center text-gray-500 mt-1">プロコーチがあなたの悩みに答えます</p>
      </header>
      
      {/* 履歴表示エリア */}
      <div className="flex-1 overflow-y-auto space-y-6 mb-4 p-2">
        {messages.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white inline-block p-6 rounded-2xl shadow-sm border border-gray-100">
              <Bot className="mx-auto mb-2 text-blue-500" size={40} />
              <p className="text-gray-600 font-medium">「サーブのトスが安定しない」</p>
              <p className="text-gray-600 font-medium">「バックハンドのコツは？」</p>
              <p className="text-gray-400 text-sm mt-2">など、何でも聞いてください！</p>
            </div>
          </div>
        )}
        
        {messages.map((m, index) => (
          <div key={index} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
            }`}>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold opacity-80">
                {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                {m.role === 'user' ? 'あなた' : 'コーチAI'}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start items-center gap-2 text-blue-500 text-sm font-medium animate-pulse">
            <Loader2 className="animate-spin" size={16} />
            コーチが回答を作成中...
          </div>
        )}
      </div>

      {/* 入力フォーム */}
      <form onSubmit={handleSend} className="flex gap-2 p-3 bg-white rounded-full shadow-lg border border-gray-200 mb-4">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isLoading ? "考え中です..." : "悩みを相談する..."}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-transparent text-black outline-none disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!inputText || isLoading}
          className={`p-3 rounded-full text-white transition-all shadow-md ${
            inputText && !isLoading ? 'bg-blue-600 hover:bg-blue-700 active:scale-95' : 'bg-gray-300'
          }`}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}