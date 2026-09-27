import { runPipeline } from './pipeline.js';

const $ = (id) => document.getElementById(id);

// ---------- Text (English / Arabic) ----------
const TEXT = {
  en: {
    pilot: 'Voice ordering · pilot',
    settings: 'Service keys',
    headline: 'Say it like you would at the harbour.',
    lede: 'Buyers ask for fish and fishermen offer their catch, just by speaking. Sayyad writes down what was said, understands it, and prepares the order.',
    micIdle: 'Tap to speak',
    micHintIdle: 'Speak in Arabic or English',
    micRecording: 'Tap when you’re done',
    micBusy: 'Working on it…',
    micBusyHint: 'This takes a few seconds',
    upload: 'or upload a voice note',
    stepRecorded: 'Voice received',
    stepTranscribing: 'Writing down what was said',
    stepUnderstanding: 'Understanding the request',
    stepReady: 'Ready',
    youSaid: 'What we heard',
    examplesTitle: 'Two ways to use it',
    tagBuyer: 'For buyers',
    buyerTitle: 'Order fish',
    buyerNote: 'Say which fish you want and how much.',
    buyerTr: '“I’d like 100 kg of kingfish and 50 kg of emperor.”',
    tagSeller: 'For fishermen & suppliers',
    sellerTitle: 'Offer your catch',
    sellerNote: 'Say which fish you have, how much, and your price per kilo.',
    sellerTr: '“I have 200 kg of tuna and 80 kg of grouper, 2 rials a kilo.”',
    footer: 'Sayyad voice ordering is a pilot for review. Recordings are processed by OpenAI (speech to text) and DeepSeek (understanding). Nothing is ordered for real.',
    credit: 'Photos: Unsplash',
    settingsTitle: 'Service keys',
    settingsIntro: 'This demo uses two AI services: OpenAI writes down the speech and DeepSeek understands it. Paste the keys your team shared with you. They are saved on this device only.',
    openaiLabel: 'OpenAI key',
    deepseekLabel: 'DeepSeek key',
    advanced: 'Advanced',
    deepseekModelLabel: 'DeepSeek model',
    whisperModelLabel: 'Speech-to-text model',
    cancel: 'Cancel',
    saveKeys: 'Save keys',
    keysSaved: 'Keys saved',
    keysNeeded: 'Add the service keys first',
    buyerBadge: 'Buyer request',
    buyerHead: 'You’re asking for',
    sellerBadge: 'Seller offer',
    sellerHead: 'You’re offering',
    colFish: 'Fish',
    colQty: 'Quantity',
    colPrice: 'Price per kg',
    colValue: 'Value',
    total: 'Total',
    buyerNext: 'Sayyad sends this request to suppliers in your region. You then choose the offer that suits you best.',
    sellerNext: 'Buyers on Sayyad see this offer and can order from it straight away.',
    unclearHead: 'That didn’t sound like an order',
    unclearBadge: 'Not understood',
    incompleteHead: 'Almost there, a detail is missing',
    incompleteBadge: 'Needs one more detail',
    tipsTitle: 'Try again and make sure to say:',
    tipFish: 'the name of the fish',
    tipQty: 'the quantity, in kilos or tons',
    tipPrice: 'your price per kilo, if you are selling',
    tryAgain: 'Record again',
    missing_fishType: 'Which fish',
    missing_quantityKg: 'How much',
    missing_pricePerKg: 'Price per kilo',
    missingFor: 'for',
    errorHead: 'The demo couldn’t finish',
    errorBadge: 'Problem',
    openSettings: 'Open service keys',
    techSummary: 'Technical view: the request Sayyad’s system would receive',
    techNote: 'This is the exact request the app will send once it is connected to Sayyad. Account IDs are placeholders.',
    copy: 'Copy',
    copied: 'Copied',
    micBlocked: 'The browser blocked the microphone. Allow microphone access for this page, or upload a voice note instead.',
  },
  ar: {
    pilot: 'الطلب بالصوت · نسخة تجريبية',
    settings: 'مفاتيح الخدمة',
    headline: 'قلها كما تقولها في الميناء.',
    lede: 'يطلب المشتري السمك ويعرض الصياد صيده بصوته فقط. صياد يكتب ما قيل ويفهمه ويجهّز الطلب.',
    micIdle: 'اضغط وتكلّم',
    micHintIdle: 'تكلّم بالعربية أو الإنجليزية',
    micRecording: 'اضغط عند الانتهاء',
    micBusy: 'جارٍ التجهيز…',
    micBusyHint: 'يستغرق ذلك بضع ثوانٍ',
    upload: 'أو ارفع رسالة صوتية',
    stepRecorded: 'تم استلام الصوت',
    stepTranscribing: 'كتابة ما قيل',
    stepUnderstanding: 'فهم الطلب',
    stepReady: 'جاهز',
    youSaid: 'ما سمعناه',
    examplesTitle: 'طريقتان للاستخدام',
    tagBuyer: 'للمشترين',
    buyerTitle: 'اطلب سمك',
    buyerNote: 'قل نوع السمك الذي تريده والكمية.',
    buyerTr: '',
    tagSeller: 'للصيادين والموردين',
    sellerTitle: 'اعرض صيدك',
    sellerNote: 'قل نوع السمك الذي عندك والكمية وسعر الكيلو.',
    sellerTr: '',
    footer: 'الطلب بالصوت في صياد نسخة تجريبية للمراجعة. تتم معالجة التسجيلات عبر OpenAI (تحويل الكلام إلى نص) وDeepSeek (فهم الطلب). لا يتم تنفيذ أي طلب فعلي.',
    credit: 'الصور: Unsplash',
    settingsTitle: 'مفاتيح الخدمة',
    settingsIntro: 'يستخدم هذا العرض خدمتين للذكاء الاصطناعي: OpenAI لكتابة الكلام وDeepSeek لفهمه. الصق المفاتيح التي شاركها فريقك معك. تُحفظ على هذا الجهاز فقط.',
    openaiLabel: 'مفتاح OpenAI',
    deepseekLabel: 'مفتاح DeepSeek',
    advanced: 'إعدادات متقدمة',
    deepseekModelLabel: 'نموذج DeepSeek',
    whisperModelLabel: 'نموذج تحويل الكلام إلى نص',
    cancel: 'إلغاء',
    saveKeys: 'حفظ المفاتيح',
    keysSaved: 'تم حفظ المفاتيح',
    keysNeeded: 'أضف مفاتيح الخدمة أولًا',
    buyerBadge: 'طلب شراء',
    buyerHead: 'أنت تطلب',
    sellerBadge: 'عرض بيع',
    sellerHead: 'أنت تعرض',
    colFish: 'السمك',
    colQty: 'الكمية',
    colPrice: 'سعر الكيلو',
    colValue: 'القيمة',
    total: 'المجموع',
    buyerNext: 'يرسل صياد هذا الطلب إلى الموردين في منطقتك، ثم تختار العرض الأنسب لك.',
    sellerNext: 'يرى المشترون في صياد هذا العرض ويمكنهم الطلب منه مباشرة.',
    unclearHead: 'لم يبدُ هذا كطلب',
    unclearBadge: 'لم يُفهم',
    incompleteHead: 'اقتربنا، تنقص معلومة',
    incompleteBadge: 'تنقص معلومة',
    tipsTitle: 'حاول مرة أخرى واحرص على ذكر:',
    tipFish: 'اسم السمك',
    tipQty: 'الكمية بالكيلو أو الطن',
    tipPrice: 'سعر الكيلو إذا كنت بائعًا',
    tryAgain: 'سجّل مرة أخرى',
    missing_fishType: 'نوع السمك',
    missing_quantityKg: 'الكمية',
    missing_pricePerKg: 'سعر الكيلو',
    missingFor: 'لـ',
    errorHead: 'تعذّر إكمال العرض',
    errorBadge: 'مشكلة',
    openSettings: 'فتح مفاتيح الخدمة',
    techSummary: 'العرض التقني: الطلب الذي سيستلمه نظام صياد',
    techNote: 'هذا هو الطلب نفسه الذي سيرسله التطبيق عند ربطه بصياد. معرّفات الحسابات مؤقتة.',
    copy: 'نسخ',
    copied: 'تم النسخ',
    micBlocked: 'منع المتصفح الوصول إلى الميكروفون. اسمح بالوصول لهذه الصفحة، أو ارفع رسالة صوتية بدلًا من ذلك.',
  },
};

let lang = storage('sayyadLang') || 'en';
const t = (key) => TEXT[lang][key] ?? TEXT.en[key];

function storage(key, value) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch { return null; }
}

function applyLang() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  $('langToggle').textContent = lang === 'ar' ? 'English' : 'العربية';
  $('langToggle').lang = lang === 'ar' ? 'en' : 'ar';
  setMic(micState);
  if (lastResult) renderOutcome(lastResult);
}

$('langToggle').onclick = () => {
  lang = lang === 'ar' ? 'en' : 'ar';
  storage('sayyadLang', lang);
  applyLang();
};

// ---------- Settings ----------
const FIELDS = ['openaiKey', 'deepseekKey', 'deepseekModel', 'whisperModel'];
const loadSettings = () => { try { return JSON.parse(storage('sayyadSettings')) || {}; } catch { return {}; } };
const hasKeys = () => { const s = loadSettings(); return Boolean(s.openaiKey && s.deepseekKey); };
const refreshKeyDot = () => $('keyDot').classList.toggle('ok', hasKeys());

function openSettings() {
  const s = loadSettings();
  FIELDS.forEach((f) => { $(f).value = s[f] || ''; });
  $('settings').showModal();
}
$('openSettings').onclick = openSettings;
$('saveSettings').onclick = () => {
  storage('sayyadSettings', JSON.stringify(Object.fromEntries(FIELDS.map((f) => [f, $(f).value.trim()]))));
  refreshKeyDot();
  toast(t('keysSaved'));
};

let toastTimer;
function toast(msg) {
  $('toast').textContent = msg;
  $('toast').hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $('toast').hidden = true; }, 2200);
}

// ---------- Sea line (signature): calm waves, driven by the voice while recording ----------
const sea = $('sea');
const ctx2d = sea.getContext('2d');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let level = 0;
let analyser, levelData;

function drawSea(time = 0) {
  const dpr = window.devicePixelRatio || 1;
  const w = sea.clientWidth, h = sea.clientHeight;
  if (sea.width !== w * dpr) { sea.width = w * dpr; sea.height = h * dpr; }
  ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx2d.clearRect(0, 0, w, h);

  if (analyser) {
    analyser.getByteTimeDomainData(levelData);
    let sum = 0;
    for (const v of levelData) sum += ((v - 128) / 128) ** 2;
    level += (Math.min(1, Math.sqrt(sum / levelData.length) * 4) - level) * 0.3;
  } else level *= 0.92;
  $('mic').style.setProperty('--level', (1 + level * 0.45).toFixed(3));

  const bg = getComputedStyle(document.body).backgroundColor;
  const s = time / 1000;
  const layers = [
    { base: h * 0.5, amp: 7 + level * 34, len: 360, speed: 0.5, fill: 'rgba(41,91,183,.35)' },
    { base: h * 0.62, amp: 5 + level * 26, len: 250, speed: -0.8, fill: 'rgba(255,255,255,.14)' },
    { base: h * 0.74, amp: 4 + level * 18, len: 300, speed: 0.35, fill: bg },
  ];
  for (const L of layers) {
    ctx2d.beginPath();
    ctx2d.moveTo(0, h);
    for (let x = 0; x <= w + 8; x += 8) {
      const y = L.base + Math.sin(x / L.len * Math.PI * 2 + s * L.speed * 2) * L.amp
        + Math.sin(x / (L.len * 0.43) + s * L.speed * 3.1) * L.amp * 0.35;
      ctx2d.lineTo(x, y);
    }
    ctx2d.lineTo(w, h);
    ctx2d.closePath();
    ctx2d.fillStyle = L.fill;
    ctx2d.fill();
  }
  if (!reduceMotion || analyser) requestAnimationFrame(drawSea);
}
requestAnimationFrame(drawSea);
addEventListener('resize', () => { if (reduceMotion) requestAnimationFrame(drawSea); });

// ---------- Recording ----------
let micState = 'idle';
let recorder, chunks = [], timer, startedAt, audioCtx;

function setMic(state) {
  micState = state;
  const mic = $('mic');
  mic.classList.toggle('recording', state === 'recording');
  mic.classList.toggle('busy', state === 'busy');
  mic.disabled = state === 'busy';
  $('file').disabled = state !== 'idle';
  const label = { idle: 'micIdle', recording: 'micRecording', busy: 'micBusy' }[state];
  $('micLabel').textContent = t(label);
  if (state === 'idle') $('micHint').textContent = t('micHintIdle');
  if (state === 'busy') $('micHint').textContent = t('micBusyHint');
  mic.setAttribute('aria-label', t(label));
}

function clock() {
  const sec = Math.floor((Date.now() - startedAt) / 1000);
  $('micHint').textContent = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

$('mic').onclick = async () => {
  if (micState === 'recording') return recorder.stop();
  if (!hasKeys()) { toast(t('keysNeeded')); return openSettings(); }
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    return showError(t('micBlocked'));
  }
  audioCtx = new AudioContext();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 1024;
  levelData = new Uint8Array(analyser.fftSize);
  audioCtx.createMediaStreamSource(stream).connect(analyser);
  if (reduceMotion) requestAnimationFrame(drawSea);

  recorder = new MediaRecorder(stream);
  chunks = [];
  recorder.ondataavailable = (e) => chunks.push(e.data);
  recorder.onstop = () => {
    clearInterval(timer);
    stream.getTracks().forEach((tr) => tr.stop());
    analyser = null;
    audioCtx.close();
    process(new Blob(chunks, { type: recorder.mimeType }));
  };
  recorder.start();
  startedAt = Date.now();
  setMic('recording');
  clock();
  timer = setInterval(clock, 250);
};

$('file').onchange = (e) => {
  const f = e.target.files[0];
  e.target.value = '';
  if (!f) return;
  if (!hasKeys()) { toast(t('keysNeeded')); return openSettings(); }
  process(f);
};

// ---------- Pipeline + results ----------
const EXTENSIONS = { webm: 'webm', ogg: 'ogg', mp4: 'mp4', mpeg: 'mp3', mp3: 'mp3', wav: 'wav', 'x-wav': 'wav', m4a: 'm4a', 'x-m4a': 'm4a' };
const STEP_ORDER = ['recorded', 'transcribing', 'understanding', 'ready'];
let lastResult = null;

function setStep(step, failed = false) {
  const idx = STEP_ORDER.indexOf(step);
  document.querySelectorAll('#steps li').forEach((li, i) => {
    li.className = i < idx || (step === 'ready' && !failed) ? 'done' : i === idx ? (failed ? 'failed' : 'active') : '';
  });
}

async function process(blob) {
  setMic('busy');
  lastResult = null;
  $('result').hidden = false;
  $('saidBox').hidden = true;
  $('outcome').hidden = true;
  setStep('transcribing');
  $('result').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });

  const mimeType = (blob.type || 'audio/webm').split(';')[0];
  const ext = EXTENSIONS[mimeType.split('/')[1]] || 'webm';
  let current = 'transcribing';
  try {
    const result = await runPipeline(blob, `recording.${ext}`, mimeType, loadSettings(), (s) => {
      current = s === 'extracting' ? 'understanding' : s;
      setStep(current);
    });
    if (result.transcript) {
      $('said').textContent = result.transcript;
      $('saidBox').hidden = false;
    }
    setStep('ready');
    lastResult = result;
    renderOutcome(result);
  } catch (err) {
    setStep(current, true);
    showError(err.message);
  } finally {
    setMic('idle');
  }
}

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
};
const locale = () => (lang === 'ar' ? 'ar-OM' : 'en-OM');
const kg = (n) => new Intl.NumberFormat(locale(), { style: 'unit', unit: 'kilogram', maximumFractionDigits: 2 }).format(n);
const omr = (n) => new Intl.NumberFormat(locale(), { style: 'currency', currency: 'OMR', minimumFractionDigits: 3 }).format(n);

function head(title, badge, warn) {
  const h = el('header', 'outcome-head' + (warn ? ' warn' : ''));
  h.append(el('h3', '', title), el('span', 'badge', badge));
  return h;
}

function fishCell(set) {
  const td = el('td');
  const primary = lang === 'en' && set.fishTypeEn ? set.fishTypeEn : set.fishType;
  const alt = primary === set.fishType ? (lang === 'en' ? null : set.fishTypeEn) : set.fishType;
  const name = el('span', 'fish-name', primary);
  name.dir = 'auto';
  td.append(name);
  if (alt) { const a = el('span', 'fish-alt', alt); a.dir = 'auto'; td.append(a); }
  return td;
}

function renderOutcome(r) {
  const box = $('outcome');
  box.replaceChildren();
  box.hidden = false;

  if (r.apiRequest) {
    const seller = r.intent === 'seller';
    box.append(head(t(seller ? 'sellerHead' : 'buyerHead'), t(seller ? 'sellerBadge' : 'buyerBadge')));

    const table = el('table', 'lines');
    const hr = el('tr');
    hr.append(el('th', '', t('colFish')), el('th', 'num', t('colQty')));
    if (seller) hr.append(el('th', 'num', t('colPrice')), el('th', 'num', t('colValue')));
    table.appendChild(el('thead')).append(hr);

    const body = table.appendChild(el('tbody'));
    let totalKg = 0, totalValue = 0;
    for (const s of r.fishSets) {
      const tr = el('tr');
      tr.append(fishCell(s), el('td', 'num', kg(s.quantityKg)));
      totalKg += s.quantityKg;
      if (seller) {
        const value = s.quantityKg * s.pricePerKg;
        totalValue += value;
        tr.append(el('td', 'num', omr(s.pricePerKg)), el('td', 'num', omr(value)));
      }
      body.append(tr);
    }
    if (r.fishSets.length > 1 || seller) {
      const fr = el('tr');
      fr.append(el('td', '', t('total')), el('td', 'num', kg(totalKg)));
      if (seller) fr.append(el('td'), el('td', 'num', omr(totalValue)));
      table.appendChild(el('tfoot')).append(fr);
    }
    box.append(table);

    const next = el('p', 'next');
    next.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z"/></svg>';
    next.append(el('span', '', t(seller ? 'sellerNext' : 'buyerNext')));
    box.append(next, techDetails(r.apiRequest));
    return;
  }

  const incomplete = Array.isArray(r.incomplete) && r.incomplete.length;
  box.append(head(t(incomplete ? 'incompleteHead' : 'unclearHead'), t(incomplete ? 'incompleteBadge' : 'unclearBadge'), true));
  const body = el('div', 'outcome-body');
  if (incomplete) {
    const ul = el('ul', 'tips');
    r.incomplete.forEach((m) => ul.append(el('li', '', t('missing_' + m.field) + (m.fishType ? ` ${t('missingFor')} ${m.fishType}` : ''))));
    body.append(ul);
  } else {
    body.append(el('p', '', r.message[lang]));
    body.append(el('p', '', t('tipsTitle')));
    const ul = el('ul', 'tips');
    ['tipFish', 'tipQty', 'tipPrice'].forEach((k) => ul.append(el('li', '', t(k))));
    body.append(ul);
  }
  const again = el('button', 'btn btn-primary', t('tryAgain'));
  again.type = 'button';
  again.onclick = () => { scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); $('mic').focus({ preventScroll: true }); };
  body.append(again);
  box.append(body);
}

function techDetails(req) {
  const d = el('details', 'tech');
  d.append(el('summary', '', t('techSummary')));
  const inner = el('div', 'tech-inner');
  inner.append(el('p', '', t('techNote')));
  const wrap = el('div', 'code-wrap');
  const text = `${req.method} ${req.path}\n\n${JSON.stringify(req.body, null, 2)}`;
  const copy = el('button', 'copy', t('copy'));
  copy.type = 'button';
  copy.onclick = async () => {
    try { await navigator.clipboard.writeText(text); copy.textContent = t('copied'); } catch {}
  };
  wrap.append(el('pre', '', text), copy);
  inner.append(wrap);
  d.append(inner);
  return d;
}

function showError(message) {
  $('result').hidden = false;
  const box = $('outcome');
  box.replaceChildren(head(t('errorHead'), t('errorBadge'), true));
  box.hidden = false;
  const body = el('div', 'outcome-body');
  body.append(el('p', '', message));
  if (/key|Settings/i.test(message)) {
    const b = el('button', 'btn btn-primary', t('openSettings'));
    b.type = 'button';
    b.onclick = openSettings;
    body.append(b);
  }
  box.append(body);
  lastResult = null;
}

refreshKeyDot();
applyLang();
