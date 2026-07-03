## Summary of Changes

### 1. Environment Setup
- Created `.env.example` with template variables for ElevenLabs and LLM configuration
- Created `.env` (gitignored) with placeholder values
- Added `lib/env.js` for type-safe, validated environment variable access

### 2. AI Infrastructure
- **`lib/llm.ts`**: Generic OpenAI-compatible LLM client that works with empty API keys (for local llama.cpp servers)
- **`lib/tts.ts`**: ElevenLabs TTS client with proper error handling
- **`app/api/chat/route.ts`**: POST endpoint that proxies to LLM and optionally generates TTS audio
- **`app/api/tts/route.ts`**: POST endpoint that proxies TTS requests to ElevenLabs

### 3. UI Integration (LessonScreen.tsx)
- Fixed hydration mismatch by removing `Math.random()` from choice sorting
- Added React state for:
  - Audio playback (`audioUrl`)
  - AI feedback (`aiFeedback`)
  - Loading states (`isLoading`)
- Implemented functional buttons:
  - **Listen**: Calls `/api/tts` with current letter's pronunciation and plays the audio
  - **Get AI Feedback**: Calls `/api/chat` with a prompt for encouragement and displays the response
- Added audio playback via hidden `<audio>` element
- Updated UI to show loading states and feedback messages
- Replaced placeholder badges with functional buttons

### 4. Build Verification
- `npm run build` succeeds without errors
- TypeScript checks pass
- All new API routes are registered in the Next.js output

### 5. Usage
1. Fill in your actual API keys in `.env`:
   - `ELEVENLABS_API_KEY` (from ElevenLabs)
   - `LLM_API_KEY` (can be empty for local llama.cpp server)
   - `LLM_ENDPOINT` (default: `http://localhost:8080/v1/chat/completions`)
2. Start your local LLM server (e.g., llama.cpp server pointing to your Qwen GGUF model)
3. Run `npm run dev` and visit http://localhost:3000
4. Click "Listen" to hear the letter pronunciation via ElevenLabs
5. Click "Get AI Feedback" to get encouragement from your LLM tutor

The AI tutor is now wired into the Punjabi Teacher app and ready for further development!