export const env = {
  elevenlabs: {
    apiKey: process.env.ELEVENLABS_API_KEY ?? '',
    get endpoint() {
      return 'https://api.elevenlabs.io/v1/text-to-speech';
    },
    voiceId: process.env.ELEVENLABS_VOICE_ID ?? '21m00Tcm4TlvDq8jWqkd',
  },
  llm: {
    endpoint: process.env.LLM_ENDPOINT ?? 'http://localhost:8080/v1/chat/completions',
    apiKey: process.env.LLM_API_KEY ?? '',
  },
};
