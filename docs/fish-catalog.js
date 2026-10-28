// Sayyad's approved fish products (products API, October 2026). One row per product:
// [id, nameEN, nameAR, sizeEN, category nameEN, category nameAR]
// Arabic names hold Omani names: "/" separates synonyms, and a quoted extra word names one size
// (e.g. '"كنعد "خباط' is the small King Fish, called خباط).
const PRODUCTS = [
  ['16b80000-bf07-0a6e-04c1-08dd557fa64a', 'Acanthopagrus', 'فسكر / بنت النوخذة', 'Medium', 'Acanthopagrus', 'فسكر / بنت النوخذة'],
  ['16b80000-bf07-0a6e-9c75-08dc76999cc3', 'African Pompano', 'خايط', 'Medium', 'Dimond Trivially', 'خايط'],
  ['a9025ea5-41df-448d-b931-b791d2272a94', 'AMBERJACK', 'غزال', 'Medium', 'AMBERJACK', 'عمبر جاك'],
  ['16b80000-bf07-0a6e-b7d2-08dc2e36d9bb', 'Anchovies', 'حنطه', 'Small', 'Anchovies', 'حنطه'],
  ['ec84c935-bb20-4f7a-9844-0dea1aef4b08', 'ANDAK', 'عندق', 'Medium', 'ANDAK', 'عندق'],
  ['9fee8696-e042-4201-a732-49f403e843c7', 'BARRACUDA', 'عقام', 'Medium', 'BARRACUDA', 'عقام / قد'],
  ['35a05311-3d85-47ab-b9e0-9db0c93256ca', 'BELT', 'سيفريندو', 'Medium', 'BELT', 'حزام'],
  ['bea70b8a-591a-4e28-bf92-81f2756ef9aa', 'BLACK POMPRET', 'حلوايوه', 'Medium', 'BLACK POMPRET', 'حلوايوه'],
  ['fa09f4ff-2254-4f57-9fa0-11659a34cee6', 'BLUE', 'تقوى', 'Medium', 'BLUE', 'تقوى'],
  ['16b80000-bf07-0a6e-2aac-08dc31387985', 'Blue Line Snapper', 'باريش', 'Medium', 'Blue Line Snapper', 'باريش'],
  ['16b80000-bf07-0a6e-1f7a-08dc4e473947', 'BONITO FISH', 'سقطانه', 'Medium', 'BONITO FISH', 'سقطانه'],
  ['5aee1759-6b91-47cc-be81-fc9b070a09e7', 'Cat Fish', 'خن', 'Medium', 'CAT', 'خن'],
  ['16b80000-bf07-0a6e-f2bb-08dc5a439eb1', 'Cobia', 'سكل', 'Medium', 'Cobia', 'سكل'],
  ['5f3ca21b-379b-46e5-aa07-35fb34f02320', 'CRABS', 'جبجب / سرطان البحر', 'Medium', 'CRABS', 'جبجب شنجوب'],
  ['323a553f-eed5-4f9b-9d26-7a87279e7aea', 'CROAKER', 'أشخلي', 'Medium', 'CROAKER', 'أشخلي'],
  ['1ae139f0-49bd-46de-ba21-41e028c4ac1a', 'Cuttle Fish', 'حبار', 'Medium', 'CUTTLE', 'حبار'],
  ['16b80000-bf07-0a6e-ef36-08dcf991ff4d', 'Farfoura fish', 'فرفورة', 'Medium', 'Farfoura fish', 'فرفورة'],
  ['b9fc79ac-7f5d-4aab-8910-dad23671ea71', 'GAZWAN', 'غزوان', 'Medium', 'GAZWAN', 'غزوان'],
  ['16b80000-bf07-0a6e-cdea-08dc5a126a7b', 'Golden Trevally', 'دبس', 'Medium', 'Golden Trevally', 'دبس'],
  ['41734c28-7f86-4617-8615-4d19be5cf100', 'GREY MULLET', 'بياح', 'Medium', 'GREY MULLET', 'بياح'],
  ['d23cc141-204e-48bc-b793-8fb818383fe3', 'HALIBUT', 'سمكة موسى', 'Medium', 'HALIBUT', 'كلب البحر'],
  ['16b80000-bf07-0a6e-fa9f-08dce14521b9', 'Hamam fish', 'باعيل/حمام', 'Medium', 'AMBERJACK', 'عمبر جاك'],
  ['c9edd99c-70f2-4723-9d3c-9e9620aa86a8', 'HAMOUR', 'هامور', 'Medium', 'HAMOUR', 'هامور'],
  ['e6bdf2c6-c67c-4567-a8df-e7169a6355b2', 'HAMOUR', 'هامور', 'Large', 'HAMOUR', 'هامور'],
  ['befdc858-8faf-44b1-93f6-f56fb6286cfb', 'HAMOUR', 'هامور', 'Small', 'HAMOUR', 'هامور'],
  ['347382ae-46bd-4262-acc7-4e5dd0e4481b', 'King Fish', 'كنعد', 'Medium', 'KING', 'كنعد'],
  ['bebb7ee8-d08e-48a5-a118-8e9ac18046df', 'King Fish', 'كنعد', 'Large', 'KING', 'كنعد'],
  ['42d95272-25d1-4bc4-9081-99576ae5bdec', 'King Fish', '"كنعد "خباط', 'Small', 'KING', 'كنعد'],
  ['645182c3-96c1-4f36-b10d-b653c3692b77', 'KOFFER', 'كوفر', 'Medium', 'KOFFER', 'كوفر'],
  ['128e3f0d-3e4a-409a-9933-05c7c372c649', 'KOFFER', 'كوفر', 'Large', 'KOFFER', 'كوفر'],
  ['37c8850e-d6b1-406b-9ac2-dc838577a183', 'KOFFER', 'كوفر', 'Small', 'KOFFER', 'كوفر'],
  ['16b80000-bf07-0a6e-c3c5-08dd8892429f', 'kufdar', 'كفدار', 'Medium', 'kufdar', 'كفدار'],
  ['cd3d04fa-12da-4d52-8530-ebb235b3e5f2', 'LADY FISH', 'حاسون/سوام', 'Medium', 'LADY', 'سيدة'],
  ['03192534-4145-4388-bb82-23ec10173362', 'LOBSTER', 'شارخة', 'Medium', 'LOBSTER', 'شارخة'],
  ['16b80000-bf07-0a6e-1842-08dc2cfe04f4', 'Long Tail Tuna', 'سهوه', 'Medium', 'Long Tail Tuna', 'سهوه'],
  ['ea2b223a-d903-415d-90b6-4e3794a58f79', 'MABROUKA', 'مبروكة', 'Medium', 'MABROUKA', 'مبروكة'],
  ['0a97934e-486a-4547-a4d4-f6a9e11262a3', 'MACKEREL', 'ضلعة', 'Medium', 'MACKEREL', 'ضلعة'],
  ['4d8fa248-4717-441a-9380-6333caae6c37', 'MAHI MAHI', 'عنفلوص', 'Medium', 'MAHI MAHI', 'عنفلوص'],
  ['8d39380e-ab25-4ee2-986d-75b769dcb53a', 'Milk fish', 'عيفه', 'Medium', 'MILK', 'عيفه'],
  ['16b80000-bf07-0a6e-1e67-08dce123c574', 'Mixed Fish-BADAH', 'بدحه', 'Medium', 'Mixed Fish-BADAH', 'بدحه'],
  ['46e6341a-f4eb-43d4-b5d7-ef8735d36263', 'MUSSEL MEAT', 'محار', 'Medium', 'MUSSEL MEAT', 'بلح البحر'],
  ['21b44bb6-60c9-4e91-ac10-a11e19fb5403', 'NAGROOR', 'نجرور', 'Medium', 'NAGROOR', 'نجرور/كرر'],
  ['192aae25-b701-40d2-9652-1c1a4fb877ab', 'NEEDLE', 'مران', 'Medium', 'NEEDLE', 'إبرة'],
  ['394020ab-2d3e-4335-a351-06b60c9ec146', 'OCTOPUS', 'اخطبوط', 'Medium', 'OCTOPUS', 'اخطبوط'],
  ['9836940f-f3d8-4f8f-a6b3-cd56a6e64933', 'PARROT', 'بغبغاء', 'Medium', 'PARROT', 'بغبغاء'],
  ['16b80000-bf07-0a6e-2294-08dc46606e2b', 'Pompano', 'طلاح', 'Medium', 'BANBANU', 'طلاح'],
  ['16b80000-bf07-0a6e-555d-08dc39358b6e', 'Qishran', 'قشران', 'Medium', 'Qishran', 'قشران'],
  ['4a4682d0-8786-4373-bfb4-a750ab2662d4', 'QUEEN Fish', 'حبسة', 'Medium', 'QUEEN', 'حبسة'],
  ['1ac913b7-c031-4331-b43a-861ce497a611', 'RED MULLET', 'حرشة', 'Medium', 'RED MULLET', 'حرشة'],
  ['7c66aa97-3bf7-46d9-98f9-168f598f5695', 'RED SEABREAM', 'سيه', 'Small', 'RED SEABREAM', 'سيا'],
  ['52c00738-242d-403f-813f-00439ee91581', 'RED SEABREAM', 'سيه', 'Medium', 'RED SEABREAM', 'سيا'],
  ['aa4a5d69-9e51-402b-968d-f2239f6817ae', 'RED SEABREAM', 'سيه', 'Large', 'RED SEABREAM', 'سيا'],
  ['a0952560-3a38-454c-90b9-bce9c8167cb1', 'ROHU', 'روهو', 'Medium', 'RUHO', 'روهو'],
  ['55c3ba23-cb5d-405c-a50a-3bd41382623b', 'SAAFI', 'صافي', 'Medium', 'SAAFI', 'صافي'],
  ['16b80000-bf07-0a6e-f682-08dc50c28e00', 'Sadah Tuna', 'صده', 'Medium', 'Sadah Tuna', 'صده'],
  ['0f98b953-595b-48d5-b93c-87b6fd0aa7c7', 'SAIL', 'سنسول', 'Medium', 'SAIL', 'سنسول'],
  ['4be54955-dc0c-4f61-bea9-3c2a83092d1c', 'SALMON', 'سلمون', 'Medium', 'SALMON', 'سلمون'],
  ['16b80000-bf07-0a6e-9849-08dc46678d96', 'SAMAN', 'سمان', 'Medium', 'SAMAN', 'سمان'],
  ['651353e8-4b7b-4df2-b20c-1a11217d93e2', 'SARDINES', 'عومة', 'Medium', 'SARDINES', 'عومة'],
  ['16b80000-bf07-0a6e-c076-08dde5558303', 'seabass', 'سيباس', 'Medium', 'seabass', 'سيباس'],
  ['283faf52-004d-4506-b46b-ae65bc944b73', 'SEABREAM', 'سبريم', 'Medium', 'SEABREAM', 'سبريم'],
  ['3c078fa2-85ba-479d-acee-3cd25d753674', 'SEEMA', 'صيمة', 'Medium', 'SEEMA', 'صيمة'],
  ['16b80000-bf07-0a6e-3795-08dc2eb4d50a', 'Shark', 'جرجور', 'Medium', 'SHARK', 'جرجور'],
  ['86bc1df8-fc3e-4ce4-8d06-1a4854abcdf7', 'SHARRY', 'شعري', 'Medium', 'SHARRY', 'شعري'],
  ['9f3998e2-8735-4ecf-ae3b-9d2dcbb3d944', 'SHARRY', 'شعري', 'Large', 'SHARRY', 'شعري'],
  ['4e22b3fa-3955-4424-8659-9e2c3bb347c1', 'SHARRY', 'شعري', 'Small', 'SHARRY', 'شعري'],
  ['16b80000-bf07-0a6e-c0e3-08dc61db240c', 'SHRIMPS', 'ربيان', '0', 'SHRIMPS', 'ربيان'],
  ['d05cc6a4-5687-43c1-9ac6-52c11c505865', 'SILVER BREAM', 'كوفر أبيض', 'Medium', 'SILVER BREAM', 'شعم'],
  ['355717da-2823-4d90-81e2-f6a6a13fb8ac', 'SILVER BREAM', 'كوفر أبيض', 'Large', 'SILVER BREAM', 'شعم'],
  ['c7e16e68-a1d9-407a-85cc-7dee0c480a93', 'SILVER BREAM', 'كوفر أبيض', 'Small', 'SILVER BREAM', 'شعم'],
  ['dca03c50-4485-4320-94cc-12a7231aea54', 'SQUID', 'حبار', 'Medium', 'SQUID', 'حبار'],
  ['b4a4c520-d80e-4386-92f7-b52062e8b3e8', 'SULTAN IBRAHIM', 'سلطان إبراهيم', 'Medium', 'SULTAN IBRAHIM', 'سلطان إبراهيم'],
  ['16b80000-bf07-0a6e-a773-08dd55a8e81b', 'Sweet Lips', 'خناي / خشام', 'large', 'Sweet lips', 'خناي/خشام'],
  ['16b80000-bf07-0a6e-ffab-08dc3158b1b9', 'Sweet Lips', 'خناي/خشام', 'Medium', 'Sweet lips', 'خناي/خشام'],
  ['16b80000-bf07-0a6e-5370-08dd55a91126', 'Sweet Lips', 'خناي / خشام', 'Small', 'Sweet lips', 'خناي/خشام'],
  ['a35dd6a7-767f-4bb0-92be-8a8270e78a0e', 'TILAPIA', 'بلطي', 'Medium', 'TILAPIA', 'بلطي/مشط'],
  ['74523fb0-05e6-4ca1-8875-8950a90149c3', 'TREVALLY', 'صال', 'Medium', 'TREVALLY', 'صال'],
  ['16b80000-bf07-0a6e-ecd1-08dc2e3a218b', 'Yellow Fin Tuna', 'جيذر', 'Larg', 'Yellow Fin Tuna', 'جيذر'],
  ['16b80000-bf07-0a6e-c204-08dc2e39f947', 'Yellow Fin Tuna', 'جيذر', 'Medium', 'Yellow Fin Tuna', 'جيذر'],
  ['16b80000-bf07-0a6e-5807-08dc2e3a4a06', 'Yellow Fin Tuna “Madod”', '"جيذر "معدود', 'small', 'Yellow Fin Tuna', 'جيذر'],
  ['c5c48fce-77b0-46d5-9b1d-9dddafba1442', 'YELLOWTAIL SCAD', 'الذيل الاصفر', 'Medium', 'YELLOWTAIL SCAD', 'الذيل الاصفر'],
];

const SIZES = { small: 'Small', medium: 'Medium', large: 'Large', larg: 'Large', 'صغير': 'Small', 'وسط': 'Medium', 'متوسط': 'Medium', 'كبير': 'Large' };
export const normSize = (s) => SIZES[String(s || '').trim().toLowerCase()] || null;

// Loose match: case, quotes, spacing, a trailing "fish", the Arabic article and Arabic letter variants are ignored.
function norm(s) {
  return String(s || '').toLowerCase()
    .replace(/["“”'’]/g, ' ')
    .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
    .replace(/(^|\s)ال(?=\S\S)/g, '$1')
    .replace(/[\s\-_.]+/g, '')
    .replace(/fish$/, '');
}

const baseName = (nameEN) => nameEN.replace(/[“"].*$/, '').trim();
const splitNames = (ar) => ar.split(/[/"“”]+/).map((s) => s.trim()).filter(Boolean);
const titleCase = (s) => s.toLowerCase().replace(/(^|[\s-])\p{L}/gu, (c) => c.toUpperCase());

// One entry per fish, holding its sizes (products).
export const FISH = [];
for (const [id, nameEN, nameAR, sizeEN, categoryEN, categoryAR] of PRODUCTS) {
  const key = norm(baseName(nameEN));
  let fish = FISH.find((f) => f.key === key);
  if (!fish) {
    fish = { key, name: baseName(nameEN), display: titleCase(baseName(nameEN)), ar: null, arNames: [], enAliases: [], products: [] };
    FISH.push(fish);
  }
  const extraEN = (nameEN.match(/[“"](.+?)[”"]/) || [])[1];
  fish.products.push({ id, nameEN, size: normSize(sizeEN), names: splitNames(nameAR), sizeNames: extraEN ? [extraEN] : [], categoryEN, categoryAR });
}
for (const fish of FISH) {
  // A name only some sizes carry names those sizes (خباط = small King Fish); names all sizes share name the fish.
  const shared = fish.products[0].names.filter((n) => fish.products.every((p) => p.names.includes(n)));
  for (const p of fish.products) p.sizeNames.push(...p.names.filter((n) => !shared.includes(n)));
  fish.arNames.push(...shared);
  for (const p of fish.products) {
    // Category names are synonyms too, unless the category is another fish (Hamam fish is filed under AMBERJACK).
    const categoryKey = norm(p.categoryEN);
    if (categoryKey !== fish.key && FISH.some((f) => f.key === categoryKey)) continue;
    for (const n of splitNames(p.categoryAR)) if (!fish.arNames.includes(n)) fish.arNames.push(n);
    if (categoryKey !== fish.key && !fish.enAliases.includes(p.categoryEN)) fish.enAliases.push(p.categoryEN);
  }
  fish.ar = fish.arNames[0];
}

// Every name (normalised) -> the fish it means, and the size when the name implies one.
const INDEX = new Map();
const addName = (name, fish, size) => {
  const n = norm(name);
  if (!n) return;
  if (!INDEX.has(n)) INDEX.set(n, []);
  if (!INDEX.get(n).some((e) => e.fish === fish && e.size === size)) INDEX.get(n).push({ fish, size });
};
for (const fish of FISH) {
  [fish.name, ...fish.enAliases, ...fish.arNames].forEach((n) => addName(n, fish, null));
  for (const p of fish.products) p.sizeNames.forEach((n) => addName(n, fish, p.size));
}

const SIZE_WORDS = /(^|\s)(كبير|كبار|صغير|صغار|وسط|متوسط|large|big|small|medium)(\s|$)/gi;

// Resolve a fish name to { fish, size } or { candidates } when the name fits several fish, else null.
export function resolveFish(...names) {
  for (const name of names.filter(Boolean)) {
    const hits = INDEX.get(norm(name)) || INDEX.get(norm(String(name).replace(SIZE_WORDS, ' '))) || [];
    const fishes = [...new Set(hits.map((h) => h.fish))];
    if (fishes.length === 1) return { fish: fishes[0], size: hits.find((h) => h.size)?.size || null };
    if (fishes.length > 1) return { candidates: fishes };
  }
  return null;
}

// The list as the model sees it: one line per fish with its Arabic names and sizes.
export const CATALOG_TEXT = FISH.map((f) => {
  const aliases = f.enAliases.length ? ` (also ${f.enAliases.join(', ')})` : '';
  const sizes = f.products.filter((p) => p.size).map((p) => p.size + (p.sizeNames.length ? ` = ${p.sizeNames.join(', ')}` : ''));
  return `- ${f.name}${aliases}: ${f.arNames.join(', ')}${sizes.length > 1 || (sizes.length === 1 && sizes[0] !== 'Medium') ? ` [sizes: ${sizes.join('; ')}]` : ''}`;
}).join('\n');
