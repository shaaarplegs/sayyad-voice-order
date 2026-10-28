// Voice pipeline: transcribe (OpenAI Whisper) -> classify intent (DeepSeek) -> extract or update the
// draft (DeepSeek) -> validate, calculate and build the API request (plain code, no model).
import { CATALOG_TEXT, resolveFish, normSize } from './fish-catalog.js';

const OPENAI_URL = 'https://api.openai.com/v1/audio/transcriptions';
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

// What each account type may create.
export const ALLOWED = { buyer: ['order'], seller: ['invoice'], both: ['order', 'invoice'] };

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
  // Bilingual vocabulary hint: spells fish names, units and prices well without pushing English speech into Arabic.
  form.append('prompt', 'Sayyad fish market, Oman. كنعد kingfish، هامور hamour، شعري sharry، جيذر yellowfin tuna، عومة sardines، عقام barracuda، خباط، معدود، سهوة، صدة، ضلعة، كوفر، سيه، صافي. كيلو kilo، طن ton، ريال rial، بيسة baisa: بريال و٢٠٠ بيسة، one rial 200 baisa. بعت I sold، أبغي I want.');

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

// Speech-to-text often writes the "و" (and) between rials and baisa as "ه": "ريال ه٢٠٠", "ريالة ميتين".
// Only rewritten when a number follows, so words like "هامور" or "هذا" after ريال are left alone.
const NUMBER_AHEAD = '(?=[0-9٠-٩]|مي|مئ|ثلاثمي|ثلثمي|اربعمي|أربعمي|خمسمي|ستمي|سبعمي|ثمانمي|تسعمي|عشر|ثلاث|اربع|أربع|خمس|ست|سبع|ثمان|تسع|نص|ربع)';
export function fixRialAnd(text) {
  return text
    .replace(new RegExp(`(ريال(?:ين|ات)?)\\s*[هة]\\s*${NUMBER_AHEAD}`, 'g'), '$1 و')
    .replace(new RegExp(`ريال[هة]\\s+${NUMBER_AHEAD}`, 'g'), 'ريال و');
}

async function deepseekJson(systemPrompt, payload) {
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
        { role: 'user', content: JSON.stringify(payload) },
      ],
    }),
  });
  if (!res.ok) throw new Error(`DeepSeek request failed (${res.status}): ${await res.text()}`);
  const content = (await res.json()).choices[0].message.content;
  return JSON.parse(content);
}

const CLASSIFY_PROMPT = `You read voice messages sent to Sayyad, a fish marketplace in Oman, and decide what the speaker wants.
Messages are transcripts in Arabic (often Omani dialect) or English.
You receive JSON: {"transcript": "...", "openDraft": null or the draft order/invoice the speaker is still completing}.

Pick exactly one intent:
- "create_invoice": a seller is billing a buyer for fish: they sold it, are selling it, or are closing a deal
  (e.g. "بعت لأحمد ٢٠٠ كيلو تونة بريالين الكيلو", "I just sold 3 tons of sardines to Ali at 300 baisa a kilo", "سوي فاتورة").
  A seller listing fish they caught or have for sale also counts (e.g. "صدت اليوم ٢٠٠ كيلو كنعد", "عندي ٥٠ كيلو هامور"); missing prices are asked for later.
- "create_order": a buyer wants to get fish (e.g. "أبغي ١٠٠ كيلو كنعد", "I need 50 kg of hamour", "I want to buy sardines").
- "continue": only when openDraft is not null and the message adds, corrects or removes details of that draft
  (a price, quantity, size or fish, e.g. "التونة بريالين", "خلها ٣٠٠ كيلو", "شيل الهامور", "the grouper was 3 rials",
  "make the kingfish 150 kilos", "remove the hamour", "add 20 kilos of sardines", "I meant yellowfin"),
  instead of starting a different request.
- "confirm": only when openDraft is not null and the speaker approves it as it is
  (e.g. "yes", "confirm", "that's correct", "go ahead", "send it", "تمام", "أكد", "اعتمد", "صح، أرسلها").
- "unrelated": anything else: not about buying or selling fish, empty, garbled, or too unclear.

Reply with JSON only: {"intent": "create_invoice" | "create_order" | "continue" | "confirm" | "unrelated", "reason": "<one short English sentence>"}`;

const MERGE_RULES = `You receive JSON: {"transcript": "...", "currentDraft": null or the draft so far}.
If currentDraft is given, the message adds to or corrects it: keep every existing item and value, fill in what the
message supplies, apply corrections (including naming the exact fish where fish was null), remove any fish the speaker
takes out, and add any new fish.
Return the whole updated draft, not just the changes.`;

const NUMBER_RULES = `- Digits (Arabic-Indic too) and spoken numbers become numbers ("ميتين" = 200, "ألف" = 1000, "طنين" = 2 tons,
  "two hundred" = 200, "a thousand" = 1000, "half a ton" = 0.5 ton, "a kilo and a half" = 1.5).
- Never invent a value. Anything that was not said is null.`;

const FISH_RULES = `- fish: the fish's exact English name from Sayyad's approved list below. Match Arabic, Omani and English names to it
  (e.g. "هامور" or "grouper" -> "HAMOUR", "كنعد" or "kingfish" -> "King Fish"). If the fish is not on the list, or the name
  fits more than one entry ("تونة" could be "Yellow Fin Tuna", "Long Tail Tuna" or "Sadah Tuna"; "حبار" could be "Cuttle Fish"
  or "SQUID"), set fish to null and put up to 4 likely list names in candidates (empty if none fits). Never invent a name.
- spoken: the fish name exactly as said.
- size: "Small", "Medium" or "Large" when said ("صغير", "وسط" or "متوسط", "كبير", "small", "medium", "large" or "big")
  or when the name implies it (see the list), else null.
- quantity + quantityUnit: the amount as a number with "kg" or "ton" (طن = ton). Do not convert units.`;

const CATALOG = `Sayyad's approved fish (English name: Arabic and Omani names [sizes]):
${CATALOG_TEXT}`;

const INVOICE_PROMPT = `You turn a seller's voice message into an invoice draft for Sayyad, a fish marketplace in Oman.
${MERGE_RULES}

An invoice is a list of fish sets, one per fish sold. For each fish set:
${FISH_RULES}
- price: how the price was said, in Omani money, split into parts. Do not convert or add them up; leave unsaid parts null.
  Omani prices: amounts up to 1000 are baisa (بيسة), and 1000 baisa = 1 rial (ريال).
  - rial: the amount said in rials, also spelled riyal, R.O. or OMR ("ريال" = 1, "ريالين" = 2, "ثلاث ريالات" = 3,
    "1.2 rial" = 1.2, "ريال ونص" or "one and a half rials" = 1.5, "ريال وربع" or "a rial and a quarter" = 1.25, "two and a half rials" = 2.5).
  - baisa: the amount said in baisa ("٨٠٠ بيسة", "800 baisa" = 800), or the number after "ريال و" / "rial and"
    ("ريال و٢٠٠", "ريال وميتين", "one rial and 200", "one rial two hundred" = rial 1, baisa 200; "ريالين وخمسمية" = rial 2, baisa 500).
  - number: a price said as a bare number with no unit ("الكيلو بـ ٨٠٠" = 800, "بثلاثة" = 3).
  - unit: "per_kg" (the usual case; a price without a unit is per kg), "per_ton", or "total" (a clear lump sum for the
    whole fish set, e.g. "الكل بأربعمية ريال", "the lot for 400 rials").
  If one price is said for several fish ("كلهم بريالين", "both for 1.2"), give it to each of those fish.
  Speech-to-text sometimes writes the "و" after ريال as "ه" ("ريال ه٢٠٠", "ريالة ميتين"): read it as "و".
Also:
- buyerName: who the fish was sold to, if said ("بعت لأحمد" -> "أحمد"), else null.
${NUMBER_RULES}

${CATALOG}

Reply with JSON only:
{"buyerName": string | null, "items": [{"spoken": string | null, "fish": string | null, "candidates": string[], "size": "Small" | "Medium" | "Large" | null, "quantity": number | null, "quantityUnit": "kg" | "ton" | null, "price": {"rial": number | null, "baisa": number | null, "number": number | null, "unit": "per_kg" | "per_ton" | "total"} | null}]}`;

const ORDER_PROMPT = `You turn a buyer's voice message into an order draft for Sayyad, a fish marketplace in Oman.
${MERGE_RULES}

An order is a list of fish with quantities. Buyers do not give prices. For each fish:
${FISH_RULES}
${NUMBER_RULES}

${CATALOG}

Reply with JSON only:
{"items": [{"spoken": string | null, "fish": string | null, "candidates": string[], "size": "Small" | "Medium" | "Large" | null, "quantity": number | null, "quantityUnit": "kg" | "ton" | null}]}`;

const round3 = (n) => Math.round((n + Number.EPSILON) * 1000) / 1000;
const positive = (v) => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : null);

// Match the fish to Sayyad's approved list and pick the product (size). Without a stated size, a fish with
// several sizes defaults to Medium, and the item says so.
function matchProduct(raw, item) {
  const match = resolveFish(raw.fish, raw.spoken);
  if (!match?.fish) {
    item.missing.push('fish');
    const named = (raw.candidates || []).map((c) => resolveFish(c)?.fish).filter(Boolean);
    item.candidates = [...new Set([...(match?.candidates || []), ...named])].slice(0, 4).map((f) => ({ en: f.display, ar: f.ar }));
    return;
  }
  const { fish } = match;
  const wanted = normSize(raw.size) || match.size;
  Object.assign(item, { fishName: fish.display, fishNameAr: fish.ar });
  const product = fish.products.length === 1 ? fish.products[0]
    : wanted ? fish.products.find((p) => p.size === wanted)
    : fish.products.find((p) => p.size === 'Medium') || fish.products[0];
  if (!product) {
    item.missing.push('size');
    item.sizeOptions = fish.products.map((p) => p.size);
    return;
  }
  Object.assign(item, { productId: product.id, productName: product.nameEN, size: product.size, sizeAssumed: !wanted && fish.products.length > 1 });
}

// Omani prices: amounts up to 1000 are baisa and 1000 baisa = 1 rial, so "ريال و٢٠٠" = 1.2 and a bare "٨٠٠"
// a kilo = 0.8. A small bare number ("بثلاثة") is rials, and so is any bare number for a ton or a lump sum.
function priceInRials(p) {
  if (!p || typeof p !== 'object') return null;
  const part = (v) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null);
  const rial = part(p.rial), baisa = part(p.baisa), bare = positive(p.number);
  if (rial !== null || baisa !== null) return positive((rial || 0) + (baisa || 0) / 1000);
  if (bare === null) return null;
  return bare >= 50 && (p.unit || 'per_kg') === 'per_kg' ? bare / 1000 : bare;
}

// Unify units (tons -> kg, price -> OMR per kg) and list what each fish set is missing.
function evaluateItem(raw, type) {
  const quantity = positive(raw.quantity);
  const item = {
    spoken: raw.spoken || raw.fish || null,
    quantityKg: quantity === null ? null : quantity * (raw.quantityUnit === 'ton' ? 1000 : 1),
    missing: [],
  };
  matchProduct(raw, item);
  if (item.quantityKg === null) item.missing.push('quantity');
  if (type === 'invoice') {
    const price = priceInRials(raw.price);
    const unit = raw.price?.unit || 'per_kg';
    if (price === null) item.missing.push('price');
    if (price !== null && unit !== 'total') item.pricePerKg = unit === 'per_ton' ? price / 1000 : price;
    if (price !== null && item.quantityKg !== null) {
      if (unit === 'total') item.pricePerKg = price / item.quantityKg;
      item.lineTotal = round3(unit === 'total' ? price : item.quantityKg * item.pricePerKg);
    }
  }
  return item;
}

// Decide whether a draft is ready, what is missing, the totals, and the API request once ready.
export function evaluateDraft(draft) {
  const items = (draft.items || []).map((raw) => evaluateItem(raw, draft.type));
  const missing = items.flatMap((item, index) => item.missing.map((field) => ({ index, fishName: item.fishName, field })));
  if (!items.length) missing.push({ index: null, fishName: null, field: 'items' });

  const complete = items.filter((item) => !item.missing.length);
  const totalKg = complete.reduce((sum, item) => sum + item.quantityKg, 0);
  const total = draft.type === 'invoice' ? round3(complete.reduce((sum, item) => sum + item.lineTotal, 0)) : null;
  const ready = missing.length === 0;

  return {
    status: ready ? 'ready' : 'needs_details',
    items,
    missing,
    completeCount: complete.length,
    buyerName: draft.buyerName || null,
    totalKg,
    total,
    // Some fish sets are complete and the rest is not: the user may finish with the complete ones only.
    canUseCompleteOnly: !ready && complete.length > 0 && complete.length < items.length,
    apiRequest: ready ? buildApiRequest(draft.type, items, draft.buyerName || null, total) : null,
  };
}

// The same draft with only its complete fish sets, for "finish with the complete items".
export function completeOnly(draft) {
  return { ...draft, items: draft.items.filter((raw) => !evaluateItem(raw, draft.type).missing.length) };
}

function buildApiRequest(type, items, buyerName, total) {
  if (type === 'order') {
    return {
      method: 'POST',
      path: '/api/v1/orders',
      body: {
        buyerId: '<BUYER_ID>',
        source: 'voice',
        items: items.map(({ productId, productName, size, quantityKg }) => ({ productId, fishName: productName, size, quantityKg })),
      },
    };
  }
  return {
    method: 'POST',
    path: '/api/v1/invoices',
    body: {
      sellerId: '<SELLER_ID>',
      source: 'voice',
      currency: 'OMR',
      buyerName,
      items: items.map(({ productId, productName, size, quantityKg, pricePerKg, lineTotal }) => ({ productId, fishName: productName, size, quantityKg, pricePerKg: round3(pricePerKg), lineTotal })),
      total,
    },
  };
}

// Understand one transcript in context: the account type and the draft still being completed (if any).
// Returns status 'ready' | 'needs_details' | 'confirm' | 'not_allowed' | 'unrelated'. 'confirm' means the
// speaker approved a complete draft. On 'not_allowed' and 'unrelated' the open draft comes back unchanged.
export async function interpret(transcript, { role = 'both', draft = null } = {}, userSettings = settings, onStep = () => {}) {
  settings = userSettings;
  if (!transcript) return { transcript, intent: 'unrelated', status: 'unrelated', reason: 'Empty transcript.', draft };
  transcript = fixRialAnd(transcript);

  onStep('understanding');
  let { intent, reason } = await deepseekJson(CLASSIFY_PROMPT, { transcript, openDraft: draft });
  if ((intent === 'continue' || intent === 'confirm') && !draft) intent = 'unrelated';
  if (intent === 'confirm') {
    const evaluation = evaluateDraft(draft);
    return { transcript, intent, reason, type: draft.type, draft, ...evaluation, status: evaluation.status === 'ready' ? 'confirm' : evaluation.status };
  }
  if (!['create_invoice', 'create_order', 'continue'].includes(intent)) {
    return { transcript, intent: 'unrelated', status: 'unrelated', reason, draft };
  }

  const type = intent === 'continue' ? draft.type : intent === 'create_order' ? 'order' : 'invoice';
  if (!ALLOWED[role].includes(type)) return { transcript, intent, type, status: 'not_allowed', reason, draft };

  onStep('extracting');
  const { type: _type, ...currentDraft } = intent === 'continue' ? draft : {};
  const out = await deepseekJson(type === 'order' ? ORDER_PROMPT : INVOICE_PROMPT, {
    transcript,
    currentDraft: intent === 'continue' ? currentDraft : null,
  });
  const next = type === 'order'
    ? { type, items: out.items || [] }
    : { type, buyerName: out.buyerName || null, items: out.items || [] };
  return { transcript, intent, reason, type, draft: next, ...evaluateDraft(next) };
}

// onStep('transcribing' | 'understanding' | 'extracting') lets the UI show progress.
export async function runPipeline(audio, filename, mimeType, userSettings, context, onStep = () => {}) {
  settings = userSettings;
  onStep('transcribing');
  const transcript = await transcribe(audio, filename, mimeType);
  return interpret(transcript, context, userSettings, onStep);
}
