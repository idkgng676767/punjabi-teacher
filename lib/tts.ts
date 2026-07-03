import { env } from './env';

/**
 * Generate TTS audio using ElevenLabs API.
 * Falls back gracefully if the API key is missing.
 */
export async function generateTTS(text: string): Promise<Buffer> {
  const { apiKey } = env.elevenlabs;

  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('ELEVENLABS_API_KEY is not set. Provide it in .env to enable TTS.');
  }

  const url = `${env.elevenlabs.endpoint}/${env.elevenlabs.voiceId}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`ElevenLabs returned ${response.status}: ${text}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
