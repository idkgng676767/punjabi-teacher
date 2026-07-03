import { NextRequest, NextResponse } from 'next/server';
import { chatWithLLM } from '@/lib/llm';
import { generateTTS } from '@/lib/tts';

/**
 * POST /api/chat
 * Body: { messages: Array<{role: string, content: string}>, lessonContext?: { currentLetter: string, stage: string } }
 * Returns: { response: string, audio?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, lessonContext } = body;

    const systemPrompt = `You are a friendly Punjabi writing tutor for absolute beginners.
Rules:
- Speak Punjabi for letter names and simple words.
- Explain in short, clear English sentences.
- Be encouraging ("Great job!", "Almost! Try again.")
- Keep responses under 2 sentences when possible.
- Use Gurmukhi script for letter examples.
${lessonContext ? `Current lesson: ${lessonContext.currentLetter}, stage: ${lessonContext.stage}` : ''}`;

    const allMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const text = await chatWithLLM(allMessages);

    // Generate TTS audio from the response
    let audio: string | undefined;
    try {
      const audioBuffer = await generateTTS(text);
      audio = `data:audio/mpeg;base64,${audioBuffer.toString('base64')}`;
    } catch (ttsErr) {
      console.warn('TTS generation failed:', ttsErr);
    }

    return NextResponse.json({ response: text, audio });
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
