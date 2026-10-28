# Integration guide (.NET)

This prototype turns a voice message (Arabic or English) into a Sayyad order or invoice. Today it runs in the browser. In production the app only records audio and shows results, and the .NET backend runs the pipeline and keeps the API keys. How it behaves for each user and action: [WORKFLOW.md](WORKFLOW.md).

## 1. Target architecture

```
App ── audio ──▶ VoiceSessionsController ──▶ VoiceService (orchestrator, ~40 lines)
                                              ├─ ISpeechToText   OpenAI Whisper
                                              ├─ IChatJson       DeepSeek, JSON mode
                                              ├─ FishCatalog     built from the products table
                                              ├─ VoiceRules      pure: prices, units, totals, what is missing
                                              └─ VoiceSessionStore  draft, status, transcripts, audio reference
Confirm ──▶ existing CreateOrder / CreateInvoice handlers
```

## 2. What to port

| Prototype | .NET | Notes |
|---|---|---|
| `docs/providers.js` | `ISpeechToText`, `IChatJson` | `HttpClient`; keys from configuration (Key Vault / user secrets), never in the app |
| `docs/prompts.js` → `integration/prompts/*.txt` | Embedded resources | Use the text as is; replace `{{CATALOG}}` with the fish list |
| `docs/fish-catalog.js` | `FishCatalog` (singleton) | `buildCatalog(products)` takes product records shaped like the products API (`id`, `nameEN`, `nameAR`, `sizeEN`, `category.nameEN/nameAR`). Rebuild when products change |
| `docs/rules.js` | `VoiceRules` (static, no I/O) | Port 1:1. It must reproduce every rule vector exactly |
| `docs/pipeline.js` | `VoiceService.InterpretAsync` | The steps in section 3 |
| `docs/app.js` | Mobile / web UI | Reference for the cards, states and wording (EN/AR) |
| `integration/contracts.schema.json` | DTOs | Generate C# with NJsonSchema or quicktype |

## 3. One voice message: `InterpretAsync(audio, role, openDraft)`

1. **Transcribe** with Whisper (`whisper-hint.txt` as prompt, no language set).
2. **Fix** the transcript: `VoiceRules.FixRialAnd` (ريال ه٢٠٠ → ريال و٢٠٠).
3. **Classify**: system = `classify.txt`, user = JSON `{ transcript, openDraft }` → `ClassifyOutput`.
4. If the intent is `continue` or `confirm` but there is no open draft, treat it as `unrelated`. On `confirm`, evaluate the open draft: if it's ready, the status is `confirm`; otherwise return that evaluation (`needs_details`).
5. If the intent is `unrelated`, return it with the open draft unchanged.
6. **Type and role**: type = the draft's type for `continue`, otherwise `order` or `invoice`. Buyer → order only, Seller → invoice only, Both → either. Otherwise return `not_allowed`, with the draft unchanged.
7. **Extract**: system = `invoice.txt` or `order.txt` with `{{CATALOG}}` filled in, user = JSON `{ transcript, currentDraft }`. Send `currentDraft` only for `continue` (the open draft without `type`), otherwise null.
8. **Evaluate**: draft = `{ type, items, buyerName? }` → `VoiceRules.EvaluateDraft(draft, catalog)` → `ready` or `needs_details`, with items, missing fields, totals, and `apiRequest` once ready.
9. **Save** the draft, status and transcript to the session, and return the `InterpretResult`.

## 4. Endpoints to add (proposal)

| Method | Route | Does |
|---|---|---|
| POST | `/api/v1/voice-sessions` | Starts a session and returns `sessionId` |
| POST | `/api/v1/voice-sessions/{id}/messages` | Takes multipart audio, returns `InterpretResult`, stores the draft |
| POST | `/api/v1/voice-sessions/{id}/complete-only` | Keeps only the complete items, then returns the result for review |
| POST | `/api/v1/voice-sessions/{id}/confirm` | Re-evaluates the stored draft (it must be `ready`), creates the order or invoice, and returns its ID |
| DELETE | `/api/v1/voice-sessions/{id}` | Start over |

- Take the role from the auth claims, never from the client.
- Confirm uses the draft stored on the server, re-evaluated. Never trust totals sent by the client.
- Store the transcripts and audio references per session. They give an audit trail and real test cases; the prototype stores nothing.

## 5. Rules to keep exactly (`docs/rules.js`, pinned by `test-vectors.json`)

- **Complete:** an invoice item needs a fish on the list, a quantity and a price; an order item needs a fish and a quantity. An empty draft is missing `items`.
- **Fish:** the model must answer with an exact list name, and code resolves it. A name that fits several fish returns `candidates` (ask the user). A fish not on the list is flagged. Never guess.
- **Size:** a stated size picks that product. Size names (خباط, معدود) mean Small. No size and several sizes → Medium, with `sizeAssumed = true`. A fish with one size → its only product.
- **Units:** tons × 1000 = kg.
- **Prices (OMR):** rial + baisa ÷ 1000. A bare number of 50 or more for a kilo is baisa. Per ton ÷ 1000. A lump sum ÷ kg.
- **Totals:** `lineTotal = round(kg × pricePerKg, 3)` and `total = Σ lineTotal of complete items`, rounded to 3 decimals. In C#, use `decimal` with `Math.Round(x, 3, MidpointRounding.AwayFromZero)`.
- **Transcript fix:** ه → و only after ريال and before a number.
- **Flow:** confirm only a `ready` draft. `unrelated` and `not_allowed` never change the draft.

## 6. Model calls

| | Speech-to-text | Chat model |
|---|---|---|
| Endpoint | `POST https://api.openai.com/v1/audio/transcriptions` (multipart) | `POST https://api.deepseek.com/chat/completions` |
| Model | `whisper-1` | `deepseek-flash` |
| Settings | `prompt` = `whisper-hint.txt`; no `language` (Arabic or English is detected) | `temperature: 0`, `response_format: json_object`; system = prompt, user = JSON payload |
| Calls per message | 1 | 2: classify + extract (1 for unrelated, not allowed or confirm) |

For production:
- Set a timeout of about 30 s.
- Retry once on a 5xx error or invalid JSON.
- Validate model replies against `ClassifyOutput`, `InvoiceExtraction` and `OrderExtraction` before using them.
- Log the model, latency and token usage.
- Whisper accepts up to 25 MB per file.

## 7. Mapping to the existing backend

- `productId` is the Sayyad product ID (fish + size) from the products table.
- `CreateOrderRequest` and `CreateInvoiceRequest` (paths `/api/v1/orders`, `/api/v1/invoices`) are placeholders. Map them to your commands. `buyerId` / `sellerId` come from auth. `buyerName` is free text; match it to a customer later if needed.
- Product rules not enforced yet: `minimumQuantity` (10 kg) and `quantityIncremental` (5 kg). Add them to `VoiceRules` as a missing or invalid reason, or validate when creating.
- Currency is OMR with 3 decimals (baisa).

## 8. Tests

```bash
npm test                              # 43 rule checks: prompt files in sync, transcript fix, prices, fish names, drafts
DEEPSEEK_API_KEY=sk-... npm test      # + 36 conversations (Arabic, English, review loop) against the live model
npm run export-prompts                # rewrite integration/prompts/*.txt after editing prompts or products
```

For the port, load `test-vectors.json` in xUnit. Rule vectors must match exactly. Run the conversations as a nightly integration test; they depend on the model.

## 9. Checklist

- [ ] API keys in server configuration; none in the app
- [ ] `FishCatalog` built from the products table and refreshed on change
- [ ] Prompts embedded as resources (`npm run export-prompts` after edits)
- [ ] `VoiceRules` ported; every rule vector passes
- [ ] Session store and endpoints; role taken from claims
- [ ] Confirm calls the existing order and invoice creation
- [ ] Model replies validated, retried once, logged
- [ ] Decision on minimum quantity and increments
- [ ] App shows the draft, review and confirmed states ([WORKFLOW.md](WORKFLOW.md), `docs/app.js`)
