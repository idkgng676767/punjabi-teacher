import { NextRequest, NextResponse } from 'next/server';
import { generateTTS } from '@/lib/tts';

/**
 * POST /api/tts
 * Body: { text: string }
 * Returns: { audio: string (base64), contentType: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid text' }, { status: 400 });
    }

    const audioBuffer = await generateTTS(text);

    return NextResponse.json({
      audio: audioBuffer.toString('base64'),
      contentType: 'audio/mpeg',
    });
  } catch (error: unknown) {
    console.error('TTS API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
