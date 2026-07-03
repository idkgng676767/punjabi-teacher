import { env } from './env';

interface ChatMessage {
  role: string;
  content: string;
}

/**
 * Generic OpenAI-compatible chat completion client.
 * If LLM_API_KEY is empty, the request is sent without an Authorization header.
 */
export async function chatWithLLM(messages: ChatMessage[]): Promise<string> {
  const { endpoint, apiKey } = env.llm;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey.trim().length > 0) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 150,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`LLM returned ${response.status}: ${text}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content ?? '';
}
