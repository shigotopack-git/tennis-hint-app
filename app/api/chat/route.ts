import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const result = await generateText({
      model: google('gemini-1.5-flash'),
      messages: messages,
      system: 'あなたはプロのテニスコーチです。具体的かつ簡潔にアドバイスしてください。'
    });
    return new Response(JSON.stringify({ text: result.text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('AI API Error:', error);
    return new Response(JSON.stringify({ error: 'AIエラー' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}