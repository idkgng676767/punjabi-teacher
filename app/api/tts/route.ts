import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';

/** Simple base64 encoder to avoid Buffer overhead if possible. */
function base64Encode(buffer: Uint8Array): string {
  let binary = '';
  const len = buffer.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary);
}

function generateTTS(text: string): Uint8Array {
  const cmd = `edge-tts --voice "pa-IN-GaganNeural" --text "${text.replace(/"/g, '\\"')}" --write-media /dev/stdout`;
  try {
    const output = execSync(cmd, { maxBuffer: 5 * 1024 * 1024 });
    return new Uint8Array(output);
  } catch (err: any) {
    throw new Error(`edge-tts failed: ${err.message || err}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = body.text;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid "text" in request body' }, { status: 400 });
    }

    const audioRaw = generateTTS(text);
    const audio = base64Encode(audioRaw);

    return NextResponse.json({ audio, contentType: 'audio/mpeg' });

  } catch (error: any) {
    console.error('TTS API route error:', error);
    return NextResponse.json({ error: error.message || 'Unknown TTS error' }, { status: 500 });
  }
}
