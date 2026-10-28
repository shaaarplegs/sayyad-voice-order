// The two outside services as plain HTTP calls with explicit settings (no shared state):
// speech-to-text (OpenAI Whisper) and a JSON-mode chat model (DeepSeek).
const OPENAI_URL = 'https://api.openai.com/v1/audio/transcriptions';
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

function requireKey(settings, name, label) {
  if (!settings[name]) throw new Error(`${label} API key is not set. Open Settings and add it.`);
  return settings[name];
}

export async function transcribe(audio, filename, settings, hint) {
  const form = new FormData();
  form.append('file', audio, filename);
  form.append('model', settings.whisperModel || 'whisper-1');
  form.append('prompt', hint);

  // OpenAI omits CORS headers on invalid-key responses, so the browser reports a network error.
  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${requireKey(settings, 'openaiKey', 'OpenAI')}` },
    body: form,
  }).catch(() => {
    throw new Error('Could not reach OpenAI. This usually means the OpenAI API key is invalid; check it in Settings.');
  });
  if (!res.ok) throw new Error(`OpenAI transcription failed (${res.status}): ${await res.text()}`);
  return (await res.json()).text.trim();
}

// Sends the system prompt plus the payload (as JSON) and returns the model's parsed JSON reply.
export async function chatJson(systemPrompt, payload, settings) {
  const res = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${requireKey(settings, 'deepseekKey', 'DeepSeek')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: settings.deepseekModel || 'deepseek-flash',
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(payload) },
      ],
    }),
  });
  if (!res.ok) throw new Error(`DeepSeek request failed (${res.status}): ${await res.text()}`);
  const content = (await res.json()).choices[0].message.content;
  return JSON.parse(content);
}
