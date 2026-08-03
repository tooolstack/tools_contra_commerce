import Anthropic from '@anthropic-ai/sdk';

// Default to the most capable model; the boss can switch to a cheaper tier for a
// high-volume free tool via CONTRA_LLM_MODEL (e.g. claude-haiku-4-5).
const MODEL = process.env.CONTRA_LLM_MODEL ?? 'claude-opus-4-8';

/** Whether a real LLM call can be made (an API key is configured). */
export function hasLlm(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/**
 * Generate a JSON object constrained to `schema` via structured outputs.
 * Throws if the API key is missing or the call fails — callers fall back to a
 * template so the tool still works in demo mode.
 */
export async function generateJson<T>(
  system: string,
  prompt: string,
  schema: Record<string, unknown>,
  imageDataUrl?: string,
): Promise<T> {
  const client = new Anthropic();

  // Optional image (vision) — parse a `data:<mime>;base64,<data>` URL.
  let content: Anthropic.MessageParam['content'] = prompt;
  const m = imageDataUrl?.match(/^data:(image\/[a-z]+);base64,(.+)$/i);
  if (m) {
    content = [
      { type: 'image', source: { type: 'base64', media_type: m[1] as 'image/png', data: m[2] } },
      { type: 'text', text: prompt },
    ];
  }

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system,
    // Structured outputs — guarantees the response matches the schema.
    output_config: { format: { type: 'json_schema', schema } },
    messages: [{ role: 'user', content }],
  });
  const block = res.content.find((b) => b.type === 'text');
  const text = block && 'text' in block ? block.text : '{}';
  return JSON.parse(text) as T;
}
