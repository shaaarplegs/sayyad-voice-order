import { runPipeline, evaluateDraft, completeOnly, ALLOWED } from './pipeline.js';

const $ = (id) => document.getElementById(id);

// ---------- Text (English / Arabic) ----------
const TEXT = {
  en: {
    pilot: 'Voice ordering · pilot',
    settings: 'Service keys',
    headline: 'Say it like you would at the harbour.',
    lede: 'Buyers order fish and sellers issue invoices, just by speaking. Sayyad writes down what was said, works out the details, and asks for anything missing.',
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
    buyerNote: 'Say the fish and how much.',
    buyerTr: '“I’d like 100 kg of king fish and 50 kg of sharry.”',
    tagSeller: 'For sellers',
    sellerTitle: 'Create an invoice',
    sellerNote: 'Say what you sold, how much, and the price per kilo.',
    sellerTr: '“I sold Ahmed 200 kg of yellowfin tuna at 2 rials a kilo and 80 kg of hamour at 3 rials.”',
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
    colFish: 'Fish',
    colQty: 'Quantity',
    colPrice: 'Price per kg',
    total: 'Total',
    unclearHead: 'We couldn’t understand that request',
    unclearBadge: 'Not understood',
    tipsTitle: 'Try again and include:',
    tryAgain: 'Record again',
    errorHead: 'The demo couldn’t finish',
    errorBadge: 'Problem',
    openSettings: 'Open service keys',
    techSummary: 'Technical view: the request Sayyad’s system would receive',
    techNote: 'This is the exact request the app will send once it is connected to Sayyad. Account IDs are placeholders.',
    copy: 'Copy',
    copied: 'Copied',
    micBlocked: 'The browser blocked the microphone. Allow microphone access for this page, or upload a voice note instead.',
    examplesNote: 'Missed a detail or want a change? Just record it. Nothing is final until you confirm.',
    roleLegend: 'Account type',
    roleBuyer: 'Buyer',
    roleSeller: 'Seller',
    roleBoth: 'Buyer & seller',
    roleHint_buyer: 'Buyer accounts place orders.',
    roleHint_seller: 'Seller accounts create invoices.',
    roleHint_both: 'This account can place orders and create invoices.',
    micContinue: 'Tap to add the missing details',
    micHintContinue_invoice: 'Your draft invoice is still open',
    micHintContinue_order: 'Your draft order is still open',
    messageN: 'Message {n}',
    invoiceBadge: 'Invoice',
    orderBadge: 'Order',
    invoiceDraftHead: 'Draft invoice: details missing',
    orderDraftHead: 'Draft order: details missing',
    draftBadge: 'Draft',
    buyerLabel: 'Buyer',
    colLineTotal: 'Line total',
    invoiceTotal: 'Invoice total',
    completeTotal: 'Total of complete items',
    totalWeight: 'Total weight',
    heardComplete: 'Complete so far: {n} of {total} fish sets.',
    noneComplete: 'None of the fish sets is complete yet.',
    stillNeed: 'We still need:',
    need_price: 'price per kilo',
    need_quantity: 'quantity',
    need_fish_choose: 'which fish exactly: {list}',
    need_fish_unknown: 'not on Sayyad’s fish list; say a fish from the list',
    need_size: 'size: {list}',
    need_items: 'The fish and quantities',
    askMissing: 'Record a short message with just these details. You don’t need to repeat the rest.',
    recordMissing: 'Record missing details',
    useComplete_invoice: 'Create invoice with complete items only ({n})',
    useComplete_order: 'Place order with complete items only ({n})',
    startOver: 'Start over',
    newRequest: 'Start a new request',
    missingChip_price: 'Price missing',
    missingChip_quantity: 'Quantity missing',
    missingChip_fish: 'Which fish?',
    missingChip_size: 'Which size?',
    size_Small: 'Small',
    size_Medium: 'Medium',
    size_Large: 'Large',
    sizeDefault: '(default)',
    invoiceNext: 'Calculated in Omani rials. In the live app, the confirmed invoice goes to the buyer.',
    orderNext: 'Sayyad sends this order to suppliers, and the buyer chooses from their offers.',
    notAllowedHead: 'Not available for this account',
    notAllowedBadge: 'Account type',
    notAllowed_invoice: 'This sounds like an invoice, but buyer accounts can only place orders. To try it in this demo, switch the account type to Seller or Buyer & seller.',
    notAllowed_order: 'This sounds like an order, but seller accounts can only create invoices. To try it in this demo, switch the account type to Buyer or Buyer & seller.',
    draftStillOpen_invoice: 'Your draft invoice is still open. Record the missing details to finish it.',
    draftStillOpen_order: 'Your draft order is still open. Record the missing details to finish it.',
    unclearText: 'We couldn’t turn that into an order or an invoice. The audio may have been unclear, or the message may not be about buying or selling fish.',
    tipOrder: 'To order: the fish and how much',
    tipInvoice: 'For an invoice: the fish you sold, how much, and the price per kilo',
    invoiceReviewHead: 'Check your invoice',
    orderReviewHead: 'Check your order',
    reviewAsk_invoice: 'Is everything right? Confirm to finish, or record what to change, for example “make the king fish 150 kilos” or “remove the hamour”.',
    reviewAsk_order: 'Is everything right? Confirm to place the order, or record what to change, for example “make it 150 kilos” or “add 20 kilos of sardines”.',
    confirm_invoice: 'Confirm invoice',
    confirm_order: 'Confirm order',
    changeByVoice: 'Change by voice',
    invoiceConfirmedHead: 'Invoice confirmed',
    orderConfirmedHead: 'Order confirmed',
    confirmedBadge: 'Confirmed',
    micRefine: 'Tap to change something',
    micHintRefine: 'Or confirm the result below',
    reviewStillOpen_invoice: 'Your invoice is still waiting for you to confirm or change it.',
    reviewStillOpen_order: 'Your order is still waiting for you to confirm or change it.',
  },
  ar: {
    pilot: 'الطلب بالصوت · نسخة تجريبية',
    settings: 'مفاتيح الخدمة',
    headline: 'قلها كما تقولها في الميناء.',
    lede: 'يطلب المشتري السمك ويصدر البائع فاتورته بصوته فقط. صياد يكتب ما قيل ويفهم التفاصيل ويسأل عن أي شيء ناقص.',
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
    buyerNote: 'قل نوع السمك والكمية.',
    buyerTr: '',
    tagSeller: 'للبائعين',
    sellerTitle: 'أنشئ فاتورة',
    sellerNote: 'قل ما بعته والكمية وسعر الكيلو.',
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
    colFish: 'السمك',
    colQty: 'الكمية',
    colPrice: 'سعر الكيلو',
    total: 'المجموع',
    unclearHead: 'لم نفهم هذا الطلب',
    unclearBadge: 'لم يُفهم',
    tipsTitle: 'حاول مرة أخرى واذكر:',
    tryAgain: 'سجّل مرة أخرى',
    errorHead: 'تعذّر إكمال العرض',
    errorBadge: 'مشكلة',
    openSettings: 'فتح مفاتيح الخدمة',
    techSummary: 'العرض التقني: الطلب الذي سيستلمه نظام صياد',
    techNote: 'هذا هو الطلب نفسه الذي سيرسله التطبيق عند ربطه بصياد. معرّفات الحسابات مؤقتة.',
    copy: 'نسخ',
    copied: 'تم النسخ',
    micBlocked: 'منع المتصفح الوصول إلى الميكروفون. اسمح بالوصول لهذه الصفحة، أو ارفع رسالة صوتية بدلًا من ذلك.',
    examplesNote: 'نسيت تفصيلًا أو تريد تعديلًا؟ سجّله فقط. لا شيء نهائي حتى تؤكد.',
    roleLegend: 'نوع الحساب',
    roleBuyer: 'مشتري',
    roleSeller: 'بائع',
    roleBoth: 'مشتري وبائع',
    roleHint_buyer: 'حساب المشتري ينشئ طلبات.',
    roleHint_seller: 'حساب البائع ينشئ فواتير.',
    roleHint_both: 'هذا الحساب ينشئ طلبات وفواتير.',
    micContinue: 'اضغط لإضافة التفاصيل الناقصة',
    micHintContinue_invoice: 'مسودة الفاتورة ما زالت مفتوحة',
    micHintContinue_order: 'مسودة الطلب ما زالت مفتوحة',
    messageN: 'الرسالة {n}',
    invoiceBadge: 'فاتورة',
    orderBadge: 'طلب',
    invoiceDraftHead: 'مسودة فاتورة: تنقص بعض التفاصيل',
    orderDraftHead: 'مسودة طلب: تنقص بعض التفاصيل',
    draftBadge: 'مسودة',
    buyerLabel: 'المشتري',
    colLineTotal: 'المجموع',
    invoiceTotal: 'إجمالي الفاتورة',
    completeTotal: 'مجموع الأصناف المكتملة',
    totalWeight: 'إجمالي الوزن',
    heardComplete: 'المكتمل حتى الآن: {n} من {total}.',
    noneComplete: 'لا يوجد صنف مكتمل بعد.',
    stillNeed: 'ما زلنا نحتاج:',
    need_price: 'سعر الكيلو',
    need_quantity: 'الكمية',
    need_fish_choose: 'أي نوع بالضبط: {list}',
    need_fish_unknown: 'ليس ضمن قائمة أسماك صياد؛ اذكر سمكًا من القائمة',
    need_size: 'الحجم: {list}',
    need_items: 'نوع السمك والكمية',
    askMissing: 'سجّل رسالة قصيرة بهذه التفاصيل فقط، ولا داعي لإعادة الباقي.',
    recordMissing: 'سجّل التفاصيل الناقصة',
    useComplete_invoice: 'أنشئ الفاتورة بالأصناف المكتملة ({n})',
    useComplete_order: 'أرسل الطلب بالأصناف المكتملة ({n})',
    startOver: 'ابدأ من جديد',
    newRequest: 'ابدأ طلبًا جديدًا',
    missingChip_price: 'السعر ناقص',
    missingChip_quantity: 'الكمية ناقصة',
    missingChip_fish: 'أي نوع؟',
    missingChip_size: 'أي حجم؟',
    size_Small: 'صغير',
    size_Medium: 'وسط',
    size_Large: 'كبير',
    sizeDefault: '(افتراضي)',
    invoiceNext: 'محسوبة بالريال العماني. في التطبيق الفعلي تُرسل الفاتورة المؤكدة إلى المشتري.',
    orderNext: 'يرسل صياد هذا الطلب إلى الموردين، ويختار المشتري من عروضهم.',
    notAllowedHead: 'غير متاح لهذا الحساب',
    notAllowedBadge: 'نوع الحساب',
    notAllowed_invoice: 'يبدو هذا فاتورة، لكن حساب المشتري ينشئ طلبات فقط. لتجربته في هذا العرض، غيّر نوع الحساب إلى بائع أو مشتري وبائع.',
    notAllowed_order: 'يبدو هذا طلبًا، لكن حساب البائع ينشئ فواتير فقط. لتجربته في هذا العرض، غيّر نوع الحساب إلى مشتري أو مشتري وبائع.',
    draftStillOpen_invoice: 'مسودة الفاتورة ما زالت مفتوحة. سجّل التفاصيل الناقصة لإكمالها.',
    draftStillOpen_order: 'مسودة الطلب ما زالت مفتوحة. سجّل التفاصيل الناقصة لإكماله.',
    unclearText: 'لم نتمكن من تحويل ذلك إلى طلب أو فاتورة. ربما لم يكن الصوت واضحًا، أو أن الرسالة لا تتعلق بشراء أو بيع السمك.',
    tipOrder: 'للطلب: نوع السمك والكمية',
    tipInvoice: 'للفاتورة: السمك الذي بعته والكمية وسعر الكيلو',
    invoiceReviewHead: 'راجع فاتورتك',
    orderReviewHead: 'راجع طلبك',
    reviewAsk_invoice: 'هل كل شيء صحيح؟ أكّد للإنهاء، أو سجّل ما تريد تغييره، مثل «خل الكنعد ١٥٠ كيلو» أو «شيل الهامور».',
    reviewAsk_order: 'هل كل شيء صحيح؟ أكّد لإرسال الطلب، أو سجّل ما تريد تغييره، مثل «خلها ١٥٠ كيلو» أو «زيد ٢٠ كيلو عومة».',
    confirm_invoice: 'تأكيد الفاتورة',
    confirm_order: 'تأكيد الطلب',
    changeByVoice: 'عدّل بالصوت',
    invoiceConfirmedHead: 'تم تأكيد الفاتورة',
    orderConfirmedHead: 'تم تأكيد الطلب',
    confirmedBadge: 'مؤكد',
    micRefine: 'اضغط لتعديل شيء',
    micHintRefine: 'أو أكّد النتيجة بالأسفل',
    reviewStillOpen_invoice: 'فاتورتك ما زالت بانتظار التأكيد أو التعديل.',
    reviewStillOpen_order: 'طلبك ما زال بانتظار التأكيد أو التعديل.',
  },
};

let lang = storage('sayyadLang') || 'en';
const t = (key) => TEXT[lang][key] ?? TEXT.en[key];
const tf = (key, vars) => Object.entries(vars).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, v), t(key));

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
  applyRole();
  renderThread();
  if (session.last) renderOutcome(session.last);
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

// ---------- Account type (stands in for the signed-in account's role) ----------
let role = storage('sayyadRole') || 'both';
const roleInputs = document.querySelectorAll('input[name="role"]');

function applyRole() {
  roleInputs.forEach((input) => { input.checked = input.value === role; });
  $('roleHint').textContent = t('roleHint_' + role);
}
roleInputs.forEach((input) => input.addEventListener('change', () => {
  role = input.value;
  storage('sayyadRole', role);
  applyRole();
}));

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
  const reviewing = state === 'idle' && session.review;
  const continuing = state === 'idle' && session.draft && !reviewing;
  const label = reviewing ? 'micRefine' : continuing ? 'micContinue' : { idle: 'micIdle', recording: 'micRecording', busy: 'micBusy' }[state];
  $('micLabel').textContent = t(label);
  if (state === 'idle') $('micHint').textContent = reviewing ? t('micHintRefine') : continuing ? t('micHintContinue_' + session.draft.type) : t('micHintIdle');
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

// One conversation: what was said so far, the draft still being completed or reviewed, and the latest result.
// review holds a complete result waiting for the user to confirm it or change it by voice.
const newSession = () => ({ turns: [], draft: null, last: null, review: null, done: false });
let session = newSession();

function setStep(step, failed = false) {
  const idx = STEP_ORDER.indexOf(step);
  document.querySelectorAll('#steps li').forEach((li, i) => {
    li.className = i < idx || (step === 'ready' && !failed) ? 'done' : i === idx ? (failed ? 'failed' : 'active') : '';
  });
}

const toTop = () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });

function resetSession() {
  session = newSession();
  $('result').hidden = true;
  setMic('idle');
  toTop();
}

async function process(blob) {
  if (session.done) {
    session = newSession();
    renderThread();
  }
  setMic('busy');
  $('result').hidden = false;
  $('outcome').hidden = true;
  setStep('transcribing');
  $('result').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });

  const mimeType = (blob.type || 'audio/webm').split(';')[0];
  const ext = EXTENSIONS[mimeType.split('/')[1]] || 'webm';
  let current = 'transcribing';
  try {
    const result = await runPipeline(blob, `recording.${ext}`, mimeType, loadSettings(), { role, draft: session.draft }, (s) => {
      current = s === 'extracting' ? 'understanding' : s;
      setStep(current);
    });
    session.turns.push(result.transcript);
    session.last = result;
    if (result.status === 'ready') {
      session.draft = result.draft;
      session.review = result;
    } else if (result.status === 'needs_details') {
      session.draft = result.draft;
      session.review = null;
    }
    setStep('ready');
    renderThread();
    if (result.status === 'confirm') confirmResult(result);
    else renderOutcome(result);
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
const chip = (field) => el('span', 'chip-missing', t('missingChip_' + field));
const count = (n) => new Intl.NumberFormat(locale()).format(n);

function renderThread() {
  $('said').replaceChildren(...session.turns.map((text, i) => {
    const li = el('li');
    const said = el('span', 'said-text', text || '—');
    said.dir = 'auto';
    li.append(el('span', 'said-n', tf('messageN', { n: count(i + 1) })), said);
    return li;
  }));
  $('saidBox').hidden = !session.turns.length;
}

function head(title, badge, warn) {
  const h = el('header', 'outcome-head' + (warn ? ' warn' : ''));
  h.append(el('h3', '', title), el('span', 'badge', badge));
  return h;
}

function button(label, cls, onClick) {
  const b = el('button', 'btn ' + cls, label);
  b.type = 'button';
  b.onclick = onClick;
  return b;
}

function actions(...buttons) {
  const div = el('div', 'outcome-actions');
  div.append(...buttons);
  return div;
}

const recordButton = () => button(t('recordMissing'), 'btn-primary', () => { toTop(); $('mic').click(); });
const startOverButton = () => button(t('startOver'), 'btn-quiet', resetSession);
const newRequestButton = () => button(t('newRequest'), 'btn-quiet', resetSession);
const changeButton = () => button(t('changeByVoice'), 'btn-quiet', () => { toTop(); $('mic').click(); });
const confirmButton = (r) => button(t('confirm_' + r.type), 'btn-primary', () => confirmResult(r));

// The final step: the reviewed result becomes the confirmed one and the conversation ends.
function confirmResult(r) {
  const confirmed = { ...r, status: 'confirmed' };
  session.draft = null;
  session.review = null;
  session.done = true;
  session.last = confirmed;
  setMic('idle');
  renderOutcome(confirmed);
  toast(t(r.type + 'ConfirmedHead'));
}
const tryAgainButton = () => button(t('tryAgain'), 'btn-primary', () => { toTop(); $('mic').focus({ preventScroll: true }); });

function useCompleteButton(r) {
  return button(tf('useComplete_' + r.type, { n: count(r.completeCount) }), 'btn-quiet', () => {
    const draft = completeOnly(r.draft);
    const ready = { ...r, draft, ...evaluateDraft(draft) };
    session.draft = draft;
    session.review = ready;
    session.last = ready;
    setMic('idle');
    renderOutcome(ready);
  });
}

// The fish as named on Sayyad's list (both languages) and its size; what was said when it isn't on the list.
function fishCell(item) {
  const td = el('td');
  const name = el('span', 'fish-name', item.fishName ? (lang === 'ar' ? item.fishNameAr : item.fishName) : item.spoken || '—');
  name.dir = 'auto';
  td.append(name);
  const size = item.size ? t('size_' + item.size) + (item.sizeAssumed ? ' ' + t('sizeDefault') : '') : null;
  const other = item.fishName && (lang === 'ar' ? item.fishName : item.fishNameAr);
  if (other || size) {
    // <bdi> keeps the other-language name from reordering the line.
    const alt = el('span', 'fish-alt');
    if (other) alt.append(el('bdi', '', other));
    if (other && size) alt.append(' · ');
    if (size) alt.append(size);
    td.append(alt);
  }
  if (item.missing.includes('fish')) td.append(chip('fish'));
  if (item.missing.includes('size')) td.append(chip('size'));
  return td;
}

const fishLabel = (item) => (lang === 'ar' ? `${item.ar} (${item.en})` : `${item.en} (${item.ar})`);

function needText(item, field) {
  if (field === 'fish') return item.candidates.length ? tf('need_fish_choose', { list: item.candidates.map(fishLabel).join(lang === 'ar' ? '، ' : ', ') }) : t('need_fish_unknown');
  if (field === 'size') return tf('need_size', { list: item.sizeOptions.map((s) => t('size_' + s)).join(' / ') });
  return t('need_' + field);
}

function valueCell(item, field, value, format) {
  const td = el('td', 'num');
  if (item.missing.includes(field)) td.append(chip(field));
  else td.textContent = value === undefined || value === null ? '—' : format(value);
  return td;
}

function itemsTable(r) {
  const invoice = r.type === 'invoice';
  const table = el('table', 'lines');
  const hr = el('tr');
  hr.append(el('th', '', t('colFish')), el('th', 'num', t('colQty')));
  if (invoice) hr.append(el('th', 'num', t('colPrice')), el('th', 'num', t('colLineTotal')));
  table.appendChild(el('thead')).append(hr);

  const body = table.appendChild(el('tbody'));
  for (const item of r.items) {
    const tr = el('tr', item.missing.length ? 'incomplete' : '');
    tr.append(fishCell(item), valueCell(item, 'quantity', item.quantityKg, kg));
    if (invoice) tr.append(valueCell(item, 'price', item.pricePerKg, omr), el('td', 'num', item.lineTotal != null ? omr(item.lineTotal) : '—'));
    body.append(tr);
  }

  const fr = el('tr');
  const totalKg = r.completeCount ? kg(r.totalKg) : '—';
  if (invoice) {
    fr.append(el('td', '', t(r.status === 'ready' ? 'invoiceTotal' : 'completeTotal')), el('td', 'num', totalKg), el('td'),
      el('td', 'num', r.completeCount ? omr(r.total) : '—'));
  } else {
    fr.append(el('td', '', t('totalWeight')), el('td', 'num', totalKg));
  }
  table.appendChild(el('tfoot')).append(fr);
  return table;
}

// The buyer's name on invoices.
function metaLine(r) {
  if (r.type !== 'invoice' || !r.buyerName) return null;
  const p = el('p', 'meta');
  const name = el('span', 'meta-value', r.buyerName);
  name.dir = 'auto';
  p.append(el('span', 'meta-label', t('buyerLabel') + ':'), name);
  return p;
}

function renderOutcome(r) {
  const box = $('outcome');
  box.replaceChildren();
  box.hidden = false;

  // A complete result is reviewed first (confirm, or change it by voice), then shown as confirmed.
  if (r.status === 'ready' || r.status === 'confirmed') {
    const confirmed = r.status === 'confirmed';
    const header = head(t(r.type + (confirmed ? 'ConfirmedHead' : 'ReviewHead')), t(confirmed ? 'confirmedBadge' : r.type + 'Badge'));
    if (confirmed) header.classList.add('ok');
    box.append(header);
    const meta = metaLine(r);
    if (meta) box.append(meta);
    box.append(itemsTable(r));
    if (!confirmed) {
      box.append(el('p', 'review-ask', t('reviewAsk_' + r.type)), techDetails(r.apiRequest), actions(confirmButton(r), changeButton(), startOverButton()));
      return;
    }
    const next = el('p', 'next');
    next.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z"/></svg>';
    next.append(el('span', '', t(r.type + 'Next')));
    box.append(next, techDetails(r.apiRequest), actions(newRequestButton()));
    return;
  }

  if (r.status === 'needs_details') {
    box.append(head(t(r.type === 'invoice' ? 'invoiceDraftHead' : 'orderDraftHead'), t('draftBadge'), true));
    const meta = metaLine(r);
    if (meta) box.append(meta);
    if (r.items.length) box.append(itemsTable(r));

    const body = el('div', 'outcome-body');
    if (r.items.length) body.append(el('p', '', r.completeCount ? tf('heardComplete', { n: count(r.completeCount), total: count(r.items.length) }) : t('noneComplete')));
    body.append(el('p', 'strong', t('stillNeed')));
    const ul = el('ul', 'tips');
    const perItem = new Map();
    for (const m of r.missing) {
      if (m.index === null) {
        ul.append(el('li', '', t('need_' + m.field)));
      } else {
        perItem.set(m.index, [...(perItem.get(m.index) || []), needText(r.items[m.index], m.field)]);
      }
    }
    for (const [index, needs] of perItem) {
      const item = r.items[index];
      const strong = el('strong');
      if (item.fishName) strong.append(el('bdi', '', lang === 'ar' ? item.fishNameAr : item.fishName));
      else if (item.spoken) strong.append(lang === 'ar' ? '«' : '“', el('bdi', '', item.spoken), lang === 'ar' ? '»' : '”');
      else strong.append(`#${index + 1}`);
      const li = el('li');
      li.append(strong, `: ${needs.join(lang === 'ar' ? '، ' : ', ')}`);
      ul.append(li);
    }
    body.append(ul, el('p', 'muted', t('askMissing')));
    box.append(body);

    const buttons = [recordButton()];
    if (r.canUseCompleteOnly) buttons.push(useCompleteButton(r));
    buttons.push(startOverButton());
    box.append(actions(...buttons));
    return;
  }

  const body = el('div', 'outcome-body');
  if (r.status === 'not_allowed') {
    box.append(head(t('notAllowedHead'), t('notAllowedBadge'), true));
    body.append(el('p', '', t('notAllowed_' + r.type)));
  } else {
    box.append(head(t('unclearHead'), t('unclearBadge'), true));
    body.append(el('p', '', t('unclearText')), el('p', '', t('tipsTitle')));
    const ul = el('ul', 'tips');
    if (ALLOWED[role].includes('order')) ul.append(el('li', '', t('tipOrder')));
    if (ALLOWED[role].includes('invoice')) ul.append(el('li', '', t('tipInvoice')));
    body.append(ul);
  }
  if (session.review) {
    body.append(el('p', 'muted', t('reviewStillOpen_' + session.review.type)));
    box.append(body, actions(confirmButton(session.review), changeButton(), startOverButton()));
    return;
  }
  if (r.draft) body.append(el('p', 'muted', t('draftStillOpen_' + r.draft.type)));
  box.append(body, actions(...(r.draft ? [recordButton(), startOverButton()] : [tryAgainButton()])));
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
}

refreshKeyDot();
applyLang();
