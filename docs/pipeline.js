// Voice-to-order pipeline: transcribe (OpenAI Whisper) -> classify intent (DeepSeek)
// -> extract fish sets (DeepSeek) -> build the backend API request.

const OPENAI_URL = 'https://api.openai.com/v1/audio/transcriptions';
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

// Keys and models come from the Settings dialog (saved in this browser only).
let settings = {};

function requireKey(name, label) {
  if (!settings[name]) throw new Error(`${label} API key is not set. Open Settings and add it.`);
  return settings[name];
}

async function transcribe(audio, filename, mimeType) {
  const form = new FormData();
  form.append('file', audio, filename);
  form.append('model', settings.whisperModel || 'whisper-1');
  // Vocabulary hint so Whisper spells fish names, units and prices well.
  form.append('prompt', 'طلب سمك في عمان: كنعد، شعري، هامور، جيذر، عومة، سردين، تونة، كوفر، باغة. كيلو، طن، ريال، بيسة. أبغي أشتري، عندي صيد للبيع.');

  // OpenAI omits CORS headers on invalid-key responses, so the browser reports a network error.
  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${requireKey('openaiKey', 'OpenAI')}` },
    body: form,
  }).catch(() => {
    throw new Error('Could not reach OpenAI. This usually means the OpenAI API key is invalid; check it in Settings.');
  });
  if (!res.ok) throw new Error(`OpenAI transcription failed (${res.status}): ${await res.text()}`);
  return (await res.json()).text.trim();
}

async function deepseekJson(systemPrompt, userText) {
  const res = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${requireKey('deepseekKey', 'DeepSeek')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: settings.deepseekModel || 'deepseek-flash',
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userText },
      ],
    }),
  });
  if (!res.ok) throw new Error(`DeepSeek request failed (${res.status}): ${await res.text()}`);
  const content = (await res.json()).choices[0].message.content;
  return JSON.parse(content);
}

const CLASSIFY_PROMPT = `You classify voice messages on Sayyad, a fish marketplace in Oman.
The message is a transcript, usually in Arabic (often Omani or Gulf dialect), sometimes English.

Classify the speaker's intent as exactly one of:
- "buyer": wants to buy / order fish (e.g. "أبغي ١٠٠ كيلو كنعد", "I want 50 kg of tuna").
- "seller": has fish to sell / is offering fish, usually with a price (e.g. "عندي ٢٠٠ كيلو شعري بريال ونص للكيلو").
- "unrelated": not about buying or selling fish, empty, garbled, or too unclear to tell.

Reply with JSON only: {"intent": "buyer" | "seller" | "unrelated", "reason": "<one short English sentence>"}`;

const FISH_SET_RULES = `A "fish set" is one fish type with its quantity.
Rules:
- fishType: the fish name as spoken, in its original language (e.g. "هامور"). Put an English name in fishTypeEn if you know it, else null.
- quantityKg: a number in kilograms. Convert tons to kg (1 طن = 1000 kg). Arabic-Indic digits and spoken numbers must become numbers.
- If a value was not mentioned, use null. Never invent values.
- One entry per fish type mentioned, in the order spoken.`;

const EXTRACT_PROMPTS = {
  buyer: `You extract a buyer's fish order from a transcript on Sayyad, a fish marketplace.
${FISH_SET_RULES}
Buyers do not give prices.

Reply with JSON only, following this schema exactly:
{"fishSets": [{"fishType": string, "fishTypeEn": string | null, "quantityKg": number | null}]}`,

  seller: `You extract a seller's fish offer from a transcript on Sayyad, a fish marketplace.
${FISH_SET_RULES}
- pricePerKg: the price in Omani rials (OMR) per kilogram, as a number. 1 rial = 1000 baisa (بيسة), so 500 baisa = 0.5. "ريال ونص" = 1.5.
- If one price is given for several fish types ("both for 2.2 riyal"), apply it to each of them.
- If the price is clearly a total for a fish set rather than per kg, divide it by that set's quantity.

Reply with JSON only, following this schema exactly:
{"fishSets": [{"fishType": string, "fishTypeEn": string | null, "quantityKg": number | null, "pricePerKg": number | null}]}`,
};

const UNRELATED_MESSAGE = {
  ar: 'عذرًا، لم نفهم طلبك. ربما لم يكن الصوت واضحًا، أو أن الرسالة لا تتعلق بشراء أو بيع السمك. حاول مرة أخرى واذكر نوع السمك والكمية، وإذا كنت بائعًا اذكر السعر أيضًا.',
  en: 'Sorry, we could not understand your request. The audio may have been unclear, or the message may not be about buying or selling fish. Please try again and say the fish type and quantity, plus your price if you are selling.',
};

function missingFields(role, fishSets) {
  const required = role === 'seller' ? ['fishType', 'quantityKg', 'pricePerKg'] : ['fishType', 'quantityKg'];
  const problems = [];
  if (!Array.isArray(fishSets) || fishSets.length === 0) return [{ fishType: null, field: 'fishType' }];
  fishSets.forEach((set) => {
    for (const field of required) {
      if (set[field] === null || set[field] === undefined || set[field] === '') {
        problems.push({ fishType: set.fishType || null, field });
      }
    }
  });
  return problems;
}

function buildApiRequest(role, fishSets) {
  if (role === 'buyer') {
    return {
      method: 'POST',
      path: '/api/v1/orders',
      body: {
        buyerId: '<BUYER_ID>',
        source: 'voice',
        fishSets: fishSets.map(({ fishType, fishTypeEn, quantityKg }) => ({ fishType, fishTypeEn, quantityKg })),
      },
    };
  }
  return {
    method: 'POST',
    path: '/api/v1/offers',
    body: {
      sellerId: '<SELLER_ID>',
      source: 'voice',
      currency: 'OMR',
      fishSets: fishSets.map(({ fishType, fishTypeEn, quantityKg, pricePerKg }) => ({ fishType, fishTypeEn, quantityKg, pricePerKg })),
    },
  };
}

// onStep('transcribing' | 'understanding' | 'extracting') lets the UI show progress.
export async function runPipeline(audio, filename, mimeType, userSettings, onStep = () => {}) {
  settings = userSettings;
  onStep('transcribing');
  const transcript = await transcribe(audio, filename, mimeType);
  if (!transcript) return { transcript, intent: 'unrelated', reason: 'Empty transcript.', message: UNRELATED_MESSAGE };

  onStep('understanding');
  const { intent, reason } = await deepseekJson(CLASSIFY_PROMPT, transcript);
  if (intent !== 'buyer' && intent !== 'seller') {
    return { transcript, intent: 'unrelated', reason, message: UNRELATED_MESSAGE };
  }

  onStep('extracting');
  const { fishSets } = await deepseekJson(EXTRACT_PROMPTS[intent], transcript);
  const problems = missingFields(intent, fishSets);
  if (problems.length) {
    return { transcript, intent, reason, fishSets, incomplete: problems, message: UNRELATED_MESSAGE };
  }

  return {
    transcript,
    intent,
    reason,
    fishSets,
    apiRequest: buildApiRequest(intent, fishSets),
  };
}
