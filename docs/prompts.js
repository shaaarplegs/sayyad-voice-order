// Every prompt the pipeline sends, as plain text. {{CATALOG}} is replaced by the fish list built in fish-catalog.js.
// integration/prompts/*.txt holds the same text for the .NET port (npm run export-prompts keeps it in sync).

// Bilingual vocabulary hint for speech-to-text: spells fish names, units and prices well without pushing English
// speech into Arabic.
export const WHISPER_HINT = 'Sayyad fish market, Oman. كنعد kingfish، هامور hamour، شعري sharry، جيذر yellowfin tuna، عومة sardines، عقام barracuda، خباط، معدود، سهوة، صدة، ضلعة، كوفر، سيه، صافي. كيلو kilo، طن ton، ريال rial، بيسة baisa: بريال و٢٠٠ بيسة، one rial 200 baisa. بعت I sold، أبغي I want.';

export const CLASSIFY_PROMPT = `You read voice messages sent to Sayyad, a fish marketplace in Oman, and decide what the speaker wants.
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
{{CATALOG}}`;

export const INVOICE_PROMPT = `You turn a seller's voice message into an invoice draft for Sayyad, a fish marketplace in Oman.
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

export const ORDER_PROMPT = `You turn a buyer's voice message into an order draft for Sayyad, a fish marketplace in Oman.
${MERGE_RULES}

An order is a list of fish with quantities. Buyers do not give prices. For each fish:
${FISH_RULES}
${NUMBER_RULES}

${CATALOG}

Reply with JSON only:
{"items": [{"spoken": string | null, "fish": string | null, "candidates": string[], "size": "Small" | "Medium" | "Large" | null, "quantity": number | null, "quantityUnit": "kg" | "ton" | null}]}`;

export const renderPrompt = (template, catalogText) => template.replace('{{CATALOG}}', () => catalogText);
