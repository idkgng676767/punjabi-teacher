import { execSync } from 'child_process';
import path from 'path';

/**
 * Generate TTS audio using edge-tts (free, no API key required).
 * Uses a Punjabi voice for appropriate pronunciation.
 */
export async function generateTTS(text: string): Promise<Buffer> {
  // Use a Punjabi female voice from Edge TTS
  const voice = 'pa-IN-GaganNeural';
  // Path to the locally installed edge-tts binary
  const edgeTsPath = path.join(process.cwd(), 'node_modules', '.bin', 'edge-tts');

  try {
    // Execute edge-tts to generate raw audio data (MP3) to stdout
    const output = execSync(`"${edgeTsPath}" --voice "${voice}" --text "${text}" --write-media -`);
    return Buffer.from(output);
  } catch (error) {
    // If edge-tts fails, throw an error
    throw new Error(`Edge TTS failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}