// Voice pipeline: transcribe (OpenAI Whisper) -> classify intent (DeepSeek) -> extract or update the
// draft (DeepSeek) -> validate, calculate and build the API request (plain code, no model).
import { GAZETTEER_TEXT, resolveLocation } from './oman-locations.js';
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
  // Vocabulary hint so Whisper spells fish names, places, units and prices well.
  form.append('prompt', 'سمك في عمان: كنعد، خباط، هامور، شعري، جيذر، معدود، سهوة، صدة، عومة، ضلعة، كوفر، سيه، صافي، باريش، خناي، حبسة، عنفلوص، عقام. كيلو، طن، ريال، بيسة. بعت، فاتورة، أبغي، التوصيل إلى العامرات، السيب، صحار، صلالة.');

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
Messages are transcripts, usually Arabic (often Omani dialect), sometimes English.
You receive JSON: {"transcript": "...", "openDraft": null or the draft order/invoice the speaker is still completing}.

Pick exactly one intent:
- "create_invoice": a seller is billing a buyer for fish: they sold it, are selling it, or are closing a deal
  (e.g. "بعت لأحمد ٢٠٠ كيلو تونة بريالين الكيلو", "I just sold 3 tons of sardines to Ali at 300 baisa a kilo", "سوي فاتورة").
  A seller listing fish they caught or have for sale also counts (e.g. "صدت اليوم ٢٠٠ كيلو كنعد", "عندي ٥٠ كيلو هامور"); missing prices are asked for later.
- "create_order": a buyer wants to get fish (e.g. "أبغي ١٠٠ كيلو كنعد توصل العامرات", "I need 50 kg of tuna in Seeb").
- "continue": only when openDraft is not null and the message adds or corrects details of that draft
  (a missing price, quantity, fish or delivery place, e.g. "التونة بريالين", "وصلها السيب", "خلها ٣٠٠ كيلو", "the grouper was 3 rials"),
  instead of starting a different request.
- "unrelated": anything else: not about buying or selling fish, empty, garbled, or too unclear.

Reply with JSON only: {"intent": "create_invoice" | "create_order" | "continue" | "unrelated", "reason": "<one short English sentence>"}`;

const MERGE_RULES = `You receive JSON: {"transcript": "...", "currentDraft": null or the draft so far}.
If currentDraft is given, the message adds to or corrects it: keep every existing item and value, fill in what the
message supplies, apply corrections (including naming the exact fish where fish was null), and add any new fish.
Return the whole updated draft, not just the changes.`;

const NUMBER_RULES = `- Arabic-Indic digits and spoken numbers become numbers ("ميتين" = 200, "ألف" = 1000, "طنين" = 2 tons).
- Never invent a value. Anything that was not said is null.`;

const FISH_RULES = `- fish: the fish's exact English name from Sayyad's approved list below. Match Arabic, Omani and English names to it
  (e.g. "هامور" or "grouper" -> "HAMOUR", "كنعد" or "kingfish" -> "King Fish"). If the fish is not on the list, or the name
  fits more than one entry ("تونة" could be "Yellow Fin Tuna", "Long Tail Tuna" or "Sadah Tuna"; "حبار" could be "Cuttle Fish"
  or "SQUID"), set fish to null and put up to 4 likely list names in candidates (empty if none fits). Never invent a name.
- spoken: the fish name exactly as said.
- size: "Small", "Medium" or "Large" when said ("صغير", "وسط" or "متوسط", "كبير") or when the name implies it (see the list), else null.
- quantity + quantityUnit: the amount as a number with "kg" or "ton" (طن = ton). Do not convert units.`;

const CATALOG = `Sayyad's approved fish (English name: Arabic and Omani names [sizes]):
${CATALOG_TEXT}`;

const INVOICE_PROMPT = `You turn a seller's voice message into an invoice draft for Sayyad, a fish marketplace in Oman.
${MERGE_RULES}

An invoice is a list of fish sets, one per fish sold. For each fish set:
${FISH_RULES}
- price + priceUnit: the price in Omani rials (OMR) as a number, with "per_kg" (the usual case), "per_ton", or "total"
  (a lump sum for that fish set). 1 rial = 1000 baisa (بيسة), so "٥٠٠ بيسة" = 0.5; "ريال ونص" = 1.5; "ريالين" = 2.
  If one price is said for several fish ("كلهم بريالين", "both for 2.2"), give it to each of those fish, per kg.
  A price without a unit is per kg. Use "total" only for a clear lump sum for the whole fish set ("الكل بأربعمية",
  "the lot for 400 rials"), usually far larger than a per-kg price (fish costs roughly 0.2 to 10 OMR per kg).
Also:
- buyerName: who the fish was sold to, if said ("بعت لأحمد" -> "أحمد"), else null.
${NUMBER_RULES}

${CATALOG}

Reply with JSON only:
{"buyerName": string | null, "items": [{"spoken": string | null, "fish": string | null, "candidates": string[], "size": "Small" | "Medium" | "Large" | null, "quantity": number | null, "quantityUnit": "kg" | "ton" | null, "price": number | null, "priceUnit": "per_kg" | "per_ton" | "total" | null}]}`;

const ORDER_PROMPT = `You turn a buyer's voice message into an order draft for Sayyad, a fish marketplace in Oman.
${MERGE_RULES}

An order is a delivery location plus a list of fish with quantities. Buyers do not give prices. For each fish:
${FISH_RULES}
Delivery location:
- location.spoken: the place as said. location.wilayat and location.governorate: exact English names from the list below, or null.
- A wilayat always belongs to one governorate; give both. "مسقط" / "Muscat" is both a governorate and a wilayat: return "Muscat" for both.
- A town or neighbourhood inside a wilayat (e.g. "الخوض" in As Seeb, "القرم" in Bawshar) maps to that wilayat.
- If no place was said, location is null (or stays as in currentDraft).
${NUMBER_RULES}

${CATALOG}

Governorates and wilayats of Oman:
${GAZETTEER_TEXT}

Reply with JSON only:
{"location": {"spoken": string, "wilayat": string | null, "governorate": string | null} | null, "items": [{"spoken": string | null, "fish": string | null, "candidates": string[], "size": "Small" | "Medium" | "Large" | null, "quantity": number | null, "quantityUnit": "kg" | "ton" | null}]}`;

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
    const price = positive(raw.price);
    if (price === null) item.missing.push('price');
    if (price !== null && raw.priceUnit !== 'total') item.pricePerKg = raw.priceUnit === 'per_ton' ? price / 1000 : price;
    if (price !== null && item.quantityKg !== null) {
      if (raw.priceUnit === 'total') item.pricePerKg = price / item.quantityKg;
      item.lineTotal = round3(raw.priceUnit === 'total' ? price : item.quantityKg * item.pricePerKg);
    }
  }
  return item;
}

// Decide whether a draft is ready, what is missing, the totals, and the API request once ready.
export function evaluateDraft(draft) {
  const items = (draft.items || []).map((raw) => evaluateItem(raw, draft.type));
  const missing = items.flatMap((item, index) => item.missing.map((field) => ({ index, fishName: item.fishName, field })));
  if (!items.length) missing.push({ index: null, fishName: null, field: 'items' });

  let location = null;
  if (draft.type === 'order') {
    location = resolveLocation(draft.location || {});
    if (!location) missing.push({ index: null, fishName: null, field: 'location', spoken: draft.location?.spoken || null });
  }

  const complete = items.filter((item) => !item.missing.length);
  const totalKg = complete.reduce((sum, item) => sum + item.quantityKg, 0);
  const total = draft.type === 'invoice' ? round3(complete.reduce((sum, item) => sum + item.lineTotal, 0)) : null;
  const ready = missing.length === 0;

  return {
    status: ready ? 'ready' : 'needs_details',
    items,
    missing,
    completeCount: complete.length,
    location,
    buyerName: draft.buyerName || null,
    totalKg,
    total,
    // Some fish sets are complete and the rest is not: the user may finish with the complete ones only.
    canUseCompleteOnly: !ready && complete.length > 0 && complete.length < items.length && (draft.type === 'invoice' || Boolean(location)),
    apiRequest: ready ? buildApiRequest(draft.type, items, location, draft.buyerName || null, total) : null,
  };
}

// The same draft with only its complete fish sets, for "finish with the complete items".
export function completeOnly(draft) {
  return { ...draft, items: draft.items.filter((raw) => !evaluateItem(raw, draft.type).missing.length) };
}

function buildApiRequest(type, items, location, buyerName, total) {
  if (type === 'order') {
    return {
      method: 'POST',
      path: '/api/v1/orders',
      body: {
        buyerId: '<BUYER_ID>',
        source: 'voice',
        deliveryLocation: { governorate: location.governorate, wilayat: location.wilayat, lat: location.lat, lng: location.lng },
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
// Returns status 'ready' | 'needs_details' | 'not_allowed' | 'unrelated'. On 'not_allowed' and
// 'unrelated' the open draft comes back unchanged, so the user can still complete it.
export async function interpret(transcript, { role = 'both', draft = null } = {}, userSettings = settings, onStep = () => {}) {
  settings = userSettings;
  if (!transcript) return { transcript, intent: 'unrelated', status: 'unrelated', reason: 'Empty transcript.', draft };

  onStep('understanding');
  let { intent, reason } = await deepseekJson(CLASSIFY_PROMPT, { transcript, openDraft: draft });
  if (intent === 'continue' && !draft) intent = 'unrelated';
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
    ? { type, location: out.location || null, items: out.items || [] }
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
