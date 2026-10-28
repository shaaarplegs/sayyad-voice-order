# Voice workflow

One voice message produces one result. An unfinished request stays open as a **draft** and carries over to the next message, until the user confirms it or starts over.

## Flow

```mermaid
flowchart TD
  A(["🎙️ Voice message"]) --> B["Speech-to-text<br/>OpenAI Whisper"]
  B --> C["Fix transcript<br/>'و' (and) in prices misheard as 'ه'"]
  C --> D{"What does the user want?<br/>DeepSeek, sees the open draft"}
  D -->|"create order / invoice"| R{"Account type<br/>allows it?"}
  D -->|"continue: add, fix, remove"| X
  D -->|"unrelated"| U["❔ Not understood<br/>tips shown, open draft kept"]
  D -->|"confirm"| K{"Open draft<br/>complete?"}
  R -->|"no"| N["⛔ Not allowed<br/>open draft kept"]
  R -->|"yes"| X["Extract items<br/>DeepSeek + Sayyad fish list"]
  X --> E["Rules in code<br/>fish and size, kg, OMR, totals"]
  E -->|"details missing"| M["📝 Draft card<br/>what we heard + what is missing<br/>next message fills the gap"]
  E -->|"complete"| V["👀 Review card<br/>Confirm · Change by voice · Start over<br/>next message = a change"]
  M -->|"Use complete items only"| V
  V -->|"Confirm button"| F(["✅ Confirmed<br/>create the order or invoice"])
  K -->|"yes"| F
  K -->|"no"| M
```

Every card waits for the next voice message: it continues the open draft (add, fix, remove or confirm) or starts a new request.

## Draft states

```mermaid
stateDiagram-v2
  direction LR
  [*] --> Draft: something missing
  [*] --> Review: complete
  Draft --> Draft: still missing
  Draft --> Review: missing part added
  Review --> Review: change by voice
  Review --> Confirmed: Confirm (button or voice)
  Draft --> [*]: Start over
  Review --> [*]: Start over
  Confirmed --> [*]
```

## Who can do what

| Account | Says "I sold…" (invoice) | Says "I want…" (order) |
|---|---|---|
| Buyer | ✗ not allowed | ✓ |
| Seller | ✓ | ✗ not allowed |
| Buyer & seller | ✓ | ✓ |

A seller describing a catch ("صدت ٢٠٠ كيلو كنعد") starts an invoice draft and is asked for prices.

## When is it complete?

| | Every item needs | Calculated in code |
|---|---|---|
| Invoice | fish on the list · quantity · price | kg, OMR per kg, line totals, invoice total (3 decimals) |
| Order | fish on the list · quantity | kg, total weight |

Some items complete, others not: the user can add the missing part by voice, or finish with the complete items only.

## Fish names

| User says | Result |
|---|---|
| A list name or Omani name (كنعد, هامور, قد, kingfish, grouper) | That fish |
| A size (كبير, large) or a size name (خباط, معدود) | That size; no size said → Medium, shown as "(default)" |
| A name that fits several fish (تونة, حبار) | Asks which one and lists the options |
| A fish not on the list (trout) | Flagged; never guessed |

## Prices (Omani rials)

| User says | OMR per kg |
|---|---|
| ريال و٢٠٠ · one rial two hundred · 1.2 rial · ١٢٠٠ بيسة | 1.200 |
| A bare ٨٠٠ for a kilo (50 and above = baisa) | 0.800 |
| بثلاثة · 3 riyals | 3.000 |
| A lump sum ("الكل بأربعمية", "400 for the lot") | lump sum ÷ kg |
| A price per ton | ÷ 1000 |
| ريال ه٢٠٠ (speech-to-text error) | read as ريال و٢٠٠ |

## Two examples

Seller account:

| # | User | System |
|---|---|---|
| 1 | "بعت ١٠٠ كيلو كنعد بأربع ريالات و٥٠ كيلو شعري" | Draft: King Fish ✓ 400.000; Sharry: price missing |
| 2 | "الشعري بريالين" | Review: total 500.000 |
| 3 | "make the king fish 150 kilos" | Review: total 700.000 |
| 4 | Taps Confirm | Confirmed → `POST /api/v1/invoices` |

Buyer account:

| # | User | System |
|---|---|---|
| 1 | "I want 50 kilos of tuna" | Draft: which tuna? Yellow Fin, Long Tail or Sadah |
| 2 | "yellowfin" | Review: Yellow Fin Tuna, Medium (default), 50 kg |
| 3 | "yes, confirm" | Confirmed → `POST /api/v1/orders` |
