# Sayyad Voice Order

A prototype that turns a spoken message (usually Arabic) into a Sayyad order or invoice. OpenAI Whisper transcribes the audio. DeepSeek decides whether the speaker wants to **create an order**, **create an invoice**, add details to an open draft, or said something unrelated, and extracts the details as JSON. Plain code then converts units (tons to kg), calculates line totals and the invoice total in Omani rials, checks what is missing, and builds the `POST /api/v1/orders` or `POST /api/v1/invoices` request. Nothing is sent to a real backend yet.

- **Account type** (Buyer, Seller, Buyer & seller) stands in for the signed-in account: buyers place orders, sellers create invoices.
- **Invoice:** fish sets of fish, quantity and price per kg. **Order:** fish and quantities.
- **Fish** must be on Sayyad's approved list (`docs/fish-catalog.js`, 65 fish / 81 products with Omani names). Each item maps to a product ID and size; no size said means Medium. A name that fits several fish ("تونة", "حبار") is asked about.
- **Prices** follow Omani usage: up to 1000 is baisa and 1000 baisa = 1 rial, so "ريال و٢٠٠", "1.2 rial" and "١٢٠٠ بيسة" are all 1.200 OMR. The model reports the parts; code does the arithmetic.
- **Incomplete requests stay open as a draft.** The page shows what it heard and what is missing; the next voice message only needs the missing part.
- **Nothing is final until confirmed.** A complete order or invoice is shown for review: confirm it with the button (or by saying "confirm"), or say what to change.
- Works the same in **English and Arabic** speech.

It is a static page: the pipeline runs in the browser, and each user's API keys (set under **Service keys**) are stored in that browser only and sent directly to OpenAI and DeepSeek.

## Run

Online: served by GitHub Pages from `docs/`. Locally (Node 18+, no dependencies):

```bash
npm start
```

Open http://localhost:3000, click **Service keys** to add your OpenAI and DeepSeek keys, pick the account type, then press the microphone and speak, or upload an audio file. Browsers only allow the microphone on `localhost` or HTTPS.

## Try saying

- Order: “أبغي ١٠٠ كيلو كنعد و٥٠ كيلو شعري” or “I want 100 kilos of kingfish and 50 kilos of sharry”
- Invoice: “بعت لأحمد ٢٠٠ كيلو جيذر بريالين الكيلو و٨٠ كيلو هامور بثلاث ريالات”
- Incomplete invoice, then a follow-up: “بعت ١٠٠ كيلو كنعد بأربع ريالات و٥٠ كيلو شعري”, then “الشعري بريالين”

The prompts, schemas and calculations are in `docs/pipeline.js`. `<BUYER_ID>` and `<SELLER_ID>` are placeholders until this is wired to real accounts. Photos are from Unsplash.
