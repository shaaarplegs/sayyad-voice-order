# Sayyad Voice Order

A prototype that turns a spoken message (usually Arabic) into a Sayyad API request. OpenAI Whisper transcribes the audio. DeepSeek then classifies the speaker as **buyer**, **seller** or **unrelated** and extracts the fish sets as JSON (fish type and quantity, plus price per kg in Omani rials for sellers). The page shows a plain-language summary next to the `POST /api/v1/orders` or `POST /api/v1/offers` request the backend would receive. Nothing is sent to a real backend yet.

It is a static page: the pipeline runs in the browser, and each user's API keys (set under **Service keys**) are stored in that browser only and sent directly to OpenAI and DeepSeek.

## Run

Online: served by GitHub Pages from `docs/`. Locally (Node 18+, no dependencies):

```bash
npm start
```

Open http://localhost:3000, click **Service keys** to add your OpenAI and DeepSeek keys, then press **Record** and speak, or upload an audio file. Browsers only allow the microphone on `localhost` or HTTPS.

## Try saying

- Buyer: “أبغي ١٠٠ كيلو كنعد و٥٠ كيلو شعري”
- Seller: “عندي ٢٠٠ كيلو تونة و٨٠ كيلو هامور، الكيلو بريالين”
- Unrelated: “كيف الجو اليوم؟” (you get the “please try again” message)

The prompts, JSON schemas and the API request shape are in `docs/pipeline.js`. `<BUYER_ID>` and `<SELLER_ID>` are placeholders until this is wired to real accounts. The page has English and Arabic; photos are from Unsplash.
