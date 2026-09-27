# Sayyad Voice Order

A prototype that turns a spoken message (usually Arabic) into a Sayyad API request. OpenAI Whisper transcribes the audio. DeepSeek then classifies the speaker as **buyer**, **seller** or **unrelated** and extracts the fish sets as JSON (fish type and quantity, plus price per kg for sellers). The page shows a plain-language summary next to the `POST /api/v1/orders` or `POST /api/v1/offers` request the backend would receive. Nothing is sent to a real backend yet.

## Run

Needs Node 21.7 or newer. There are no dependencies to install.

```bash
cp .env.example .env   # then add OPENAI_API_KEY and DEEPSEEK_API_KEY
npm start
```

Open http://localhost:3000, press **Record** and speak, or upload an audio file. Browsers only allow the microphone on `localhost` or HTTPS.

## Try saying

- Buyer: “أبغى ١٠٠ كيلو هامور و طن شعور”
- Seller: “عندي ٥٠ كيلو هامور و ٣٠ كيلو كنعد، الاثنين بـ ٢.٢ ريال للكيلو”
- Unrelated: “كيف الجو اليوم؟” (you get the “please try again” message)

The prompts, JSON schemas and the API request shape are in `pipeline.js`. `<BUYER_ID>` and `<SELLER_ID>` are placeholders until this is wired to real accounts.
