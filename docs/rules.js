// Business rules with no I/O: the transcript fix, Omani price parsing, units, catalog matching, totals, what is
// missing, and the backend request. Port these 1:1; integration/test-vectors.json pins their behaviour.
import { normSize } from './fish-catalog.js';

// What each account type may create.
export const ALLOWED = { buyer: ['order'], seller: ['invoice'], both: ['order', 'invoice'] };

// Speech-to-text often writes the "و" (and) between rials and baisa as "ه": "ريال ه٢٠٠", "ريالة ميتين".
// Only rewritten when a number follows, so words like "هامور" or "هذا" after ريال are left alone.
const NUMBER_AHEAD = '(?=[0-9٠-٩]|مي|مئ|ثلاثمي|ثلثمي|اربعمي|أربعمي|خمسمي|ستمي|سبعمي|ثمانمي|تسعمي|عشر|ثلاث|اربع|أربع|خمس|ست|سبع|ثمان|تسع|نص|ربع)';
export function fixRialAnd(text) {
  return text
    .replace(new RegExp(`(ريال(?:ين|ات)?)\\s*[هة]\\s*${NUMBER_AHEAD}`, 'g'), '$1 و')
    .replace(new RegExp(`ريال[هة]\\s+${NUMBER_AHEAD}`, 'g'), 'ريال و');
}

const round3 = (n) => Math.round((n + Number.EPSILON) * 1000) / 1000;
const positive = (v) => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : null);

// Match the fish to Sayyad's approved list and pick the product (size). Without a stated size, a fish with
// several sizes defaults to Medium, and the item says so.
function matchProduct(raw, item, catalog) {
  const match = catalog.resolveFish(raw.fish, raw.spoken);
  if (!match?.fish) {
    item.missing.push('fish');
    const named = (raw.candidates || []).map((c) => catalog.resolveFish(c)?.fish).filter(Boolean);
    item.candidates = [...new Set([...(match?.candidates || []), ...named])].slice(0, 4).map((f) => ({ en: f.display, ar: f.ar }));
    return;
  }
  const { fish } = match;
  // A size word in the spoken name counts too ("خباط" = small King Fish) when the model leaves size empty.
  const spokenMatch = catalog.resolveFish(raw.spoken);
  const wanted = normSize(raw.size) || match.size || (spokenMatch?.fish === fish ? spokenMatch.size : null);
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
export function priceInRials(p) {
  if (!p || typeof p !== 'object') return null;
  const part = (v) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null);
  const rial = part(p.rial), baisa = part(p.baisa), bare = positive(p.number);
  if (rial !== null || baisa !== null) return positive((rial || 0) + (baisa || 0) / 1000);
  if (bare === null) return null;
  return bare >= 50 && (p.unit || 'per_kg') === 'per_kg' ? bare / 1000 : bare;
}

// Unify units (tons -> kg, price -> OMR per kg) and list what each fish set is missing.
function evaluateItem(raw, type, catalog) {
  const quantity = positive(raw.quantity);
  const item = {
    spoken: raw.spoken || raw.fish || null,
    quantityKg: quantity === null ? null : quantity * (raw.quantityUnit === 'ton' ? 1000 : 1),
    missing: [],
  };
  matchProduct(raw, item, catalog);
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
export function evaluateDraft(draft, catalog) {
  const items = (draft.items || []).map((raw) => evaluateItem(raw, draft.type, catalog));
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
export function completeOnly(draft, catalog) {
  return { ...draft, items: draft.items.filter((raw) => !evaluateItem(raw, draft.type, catalog).missing.length) };
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
