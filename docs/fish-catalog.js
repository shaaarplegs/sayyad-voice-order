// Sayyad's approved fish products (products API, October 2026), with only the fields the pipeline uses.
// Arabic names hold Omani names: "/" separates synonyms, and a quoted extra word names one size
// (e.g. '"كنعد "خباط' is the small King Fish, called خباط). In production, load these from the products table.
export const PRODUCTS = [
  { id: '16b80000-bf07-0a6e-04c1-08dd557fa64a', nameEN: 'Acanthopagrus', nameAR: 'فسكر / بنت النوخذة', sizeEN: 'Medium', category: { nameEN: 'Acanthopagrus', nameAR: 'فسكر / بنت النوخذة' } },
  { id: '16b80000-bf07-0a6e-9c75-08dc76999cc3', nameEN: 'African Pompano', nameAR: 'خايط', sizeEN: 'Medium', category: { nameEN: 'Dimond Trivially', nameAR: 'خايط' } },
  { id: 'a9025ea5-41df-448d-b931-b791d2272a94', nameEN: 'AMBERJACK', nameAR: 'غزال', sizeEN: 'Medium', category: { nameEN: 'AMBERJACK', nameAR: 'عمبر جاك' } },
  { id: '16b80000-bf07-0a6e-b7d2-08dc2e36d9bb', nameEN: 'Anchovies', nameAR: 'حنطه', sizeEN: 'Small', category: { nameEN: 'Anchovies', nameAR: 'حنطه' } },
  { id: 'ec84c935-bb20-4f7a-9844-0dea1aef4b08', nameEN: 'ANDAK', nameAR: 'عندق', sizeEN: 'Medium', category: { nameEN: 'ANDAK', nameAR: 'عندق' } },
  { id: '9fee8696-e042-4201-a732-49f403e843c7', nameEN: 'BARRACUDA', nameAR: 'عقام', sizeEN: 'Medium', category: { nameEN: 'BARRACUDA', nameAR: 'عقام / قد' } },
  { id: '35a05311-3d85-47ab-b9e0-9db0c93256ca', nameEN: 'BELT', nameAR: 'سيفريندو', sizeEN: 'Medium', category: { nameEN: 'BELT', nameAR: 'حزام' } },
  { id: 'bea70b8a-591a-4e28-bf92-81f2756ef9aa', nameEN: 'BLACK POMPRET', nameAR: 'حلوايوه', sizeEN: 'Medium', category: { nameEN: 'BLACK POMPRET', nameAR: 'حلوايوه' } },
  { id: 'fa09f4ff-2254-4f57-9fa0-11659a34cee6', nameEN: 'BLUE', nameAR: 'تقوى', sizeEN: 'Medium', category: { nameEN: 'BLUE', nameAR: 'تقوى' } },
  { id: '16b80000-bf07-0a6e-2aac-08dc31387985', nameEN: 'Blue Line Snapper', nameAR: 'باريش', sizeEN: 'Medium', category: { nameEN: 'Blue Line Snapper', nameAR: 'باريش' } },
  { id: '16b80000-bf07-0a6e-1f7a-08dc4e473947', nameEN: 'BONITO FISH', nameAR: 'سقطانه', sizeEN: 'Medium', category: { nameEN: 'BONITO FISH', nameAR: 'سقطانه' } },
  { id: '5aee1759-6b91-47cc-be81-fc9b070a09e7', nameEN: 'Cat Fish', nameAR: 'خن', sizeEN: 'Medium', category: { nameEN: 'CAT', nameAR: 'خن' } },
  { id: '16b80000-bf07-0a6e-f2bb-08dc5a439eb1', nameEN: 'Cobia', nameAR: 'سكل', sizeEN: 'Medium', category: { nameEN: 'Cobia', nameAR: 'سكل' } },
  { id: '5f3ca21b-379b-46e5-aa07-35fb34f02320', nameEN: 'CRABS', nameAR: 'جبجب / سرطان البحر', sizeEN: 'Medium', category: { nameEN: 'CRABS', nameAR: 'جبجب شنجوب' } },
  { id: '323a553f-eed5-4f9b-9d26-7a87279e7aea', nameEN: 'CROAKER', nameAR: 'أشخلي', sizeEN: 'Medium', category: { nameEN: 'CROAKER', nameAR: 'أشخلي' } },
  { id: '1ae139f0-49bd-46de-ba21-41e028c4ac1a', nameEN: 'Cuttle Fish', nameAR: 'حبار', sizeEN: 'Medium', category: { nameEN: 'CUTTLE', nameAR: 'حبار' } },
  { id: '16b80000-bf07-0a6e-ef36-08dcf991ff4d', nameEN: 'Farfoura fish', nameAR: 'فرفورة', sizeEN: 'Medium', category: { nameEN: 'Farfoura fish', nameAR: 'فرفورة' } },
  { id: 'b9fc79ac-7f5d-4aab-8910-dad23671ea71', nameEN: 'GAZWAN', nameAR: 'غزوان', sizeEN: 'Medium', category: { nameEN: 'GAZWAN', nameAR: 'غزوان' } },
  { id: '16b80000-bf07-0a6e-cdea-08dc5a126a7b', nameEN: 'Golden Trevally', nameAR: 'دبس', sizeEN: 'Medium', category: { nameEN: 'Golden Trevally', nameAR: 'دبس' } },
  { id: '41734c28-7f86-4617-8615-4d19be5cf100', nameEN: 'GREY MULLET', nameAR: 'بياح', sizeEN: 'Medium', category: { nameEN: 'GREY MULLET', nameAR: 'بياح' } },
  { id: 'd23cc141-204e-48bc-b793-8fb818383fe3', nameEN: 'HALIBUT', nameAR: 'سمكة موسى', sizeEN: 'Medium', category: { nameEN: 'HALIBUT', nameAR: 'كلب البحر' } },
  { id: '16b80000-bf07-0a6e-fa9f-08dce14521b9', nameEN: 'Hamam fish', nameAR: 'باعيل/حمام', sizeEN: 'Medium', category: { nameEN: 'AMBERJACK', nameAR: 'عمبر جاك' } },
  { id: 'c9edd99c-70f2-4723-9d3c-9e9620aa86a8', nameEN: 'HAMOUR', nameAR: 'هامور', sizeEN: 'Medium', category: { nameEN: 'HAMOUR', nameAR: 'هامور' } },
  { id: 'e6bdf2c6-c67c-4567-a8df-e7169a6355b2', nameEN: 'HAMOUR', nameAR: 'هامور', sizeEN: 'Large', category: { nameEN: 'HAMOUR', nameAR: 'هامور' } },
  { id: 'befdc858-8faf-44b1-93f6-f56fb6286cfb', nameEN: 'HAMOUR', nameAR: 'هامور', sizeEN: 'Small', category: { nameEN: 'HAMOUR', nameAR: 'هامور' } },
  { id: '347382ae-46bd-4262-acc7-4e5dd0e4481b', nameEN: 'King Fish', nameAR: 'كنعد', sizeEN: 'Medium', category: { nameEN: 'KING', nameAR: 'كنعد' } },
  { id: 'bebb7ee8-d08e-48a5-a118-8e9ac18046df', nameEN: 'King Fish', nameAR: 'كنعد', sizeEN: 'Large', category: { nameEN: 'KING', nameAR: 'كنعد' } },
  { id: '42d95272-25d1-4bc4-9081-99576ae5bdec', nameEN: 'King Fish', nameAR: '"كنعد "خباط', sizeEN: 'Small', category: { nameEN: 'KING', nameAR: 'كنعد' } },
  { id: '645182c3-96c1-4f36-b10d-b653c3692b77', nameEN: 'KOFFER', nameAR: 'كوفر', sizeEN: 'Medium', category: { nameEN: 'KOFFER', nameAR: 'كوفر' } },
  { id: '128e3f0d-3e4a-409a-9933-05c7c372c649', nameEN: 'KOFFER', nameAR: 'كوفر', sizeEN: 'Large', category: { nameEN: 'KOFFER', nameAR: 'كوفر' } },
  { id: '37c8850e-d6b1-406b-9ac2-dc838577a183', nameEN: 'KOFFER', nameAR: 'كوفر', sizeEN: 'Small', category: { nameEN: 'KOFFER', nameAR: 'كوفر' } },
  { id: '16b80000-bf07-0a6e-c3c5-08dd8892429f', nameEN: 'kufdar', nameAR: 'كفدار', sizeEN: 'Medium', category: { nameEN: 'kufdar', nameAR: 'كفدار' } },
  { id: 'cd3d04fa-12da-4d52-8530-ebb235b3e5f2', nameEN: 'LADY FISH', nameAR: 'حاسون/سوام', sizeEN: 'Medium', category: { nameEN: 'LADY', nameAR: 'سيدة' } },
  { id: '03192534-4145-4388-bb82-23ec10173362', nameEN: 'LOBSTER', nameAR: 'شارخة', sizeEN: 'Medium', category: { nameEN: 'LOBSTER', nameAR: 'شارخة' } },
  { id: '16b80000-bf07-0a6e-1842-08dc2cfe04f4', nameEN: 'Long Tail Tuna', nameAR: 'سهوه', sizeEN: 'Medium', category: { nameEN: 'Long Tail Tuna', nameAR: 'سهوه' } },
  { id: 'ea2b223a-d903-415d-90b6-4e3794a58f79', nameEN: 'MABROUKA', nameAR: 'مبروكة', sizeEN: 'Medium', category: { nameEN: 'MABROUKA', nameAR: 'مبروكة' } },
  { id: '0a97934e-486a-4547-a4d4-f6a9e11262a3', nameEN: 'MACKEREL', nameAR: 'ضلعة', sizeEN: 'Medium', category: { nameEN: 'MACKEREL', nameAR: 'ضلعة' } },
  { id: '4d8fa248-4717-441a-9380-6333caae6c37', nameEN: 'MAHI MAHI', nameAR: 'عنفلوص', sizeEN: 'Medium', category: { nameEN: 'MAHI MAHI', nameAR: 'عنفلوص' } },
  { id: '8d39380e-ab25-4ee2-986d-75b769dcb53a', nameEN: 'Milk fish', nameAR: 'عيفه', sizeEN: 'Medium', category: { nameEN: 'MILK', nameAR: 'عيفه' } },
  { id: '16b80000-bf07-0a6e-1e67-08dce123c574', nameEN: 'Mixed Fish-BADAH', nameAR: 'بدحه', sizeEN: 'Medium', category: { nameEN: 'Mixed Fish-BADAH', nameAR: 'بدحه' } },
  { id: '46e6341a-f4eb-43d4-b5d7-ef8735d36263', nameEN: 'MUSSEL MEAT', nameAR: 'محار', sizeEN: 'Medium', category: { nameEN: 'MUSSEL MEAT', nameAR: 'بلح البحر' } },
  { id: '21b44bb6-60c9-4e91-ac10-a11e19fb5403', nameEN: 'NAGROOR', nameAR: 'نجرور', sizeEN: 'Medium', category: { nameEN: 'NAGROOR', nameAR: 'نجرور/كرر' } },
  { id: '192aae25-b701-40d2-9652-1c1a4fb877ab', nameEN: 'NEEDLE', nameAR: 'مران', sizeEN: 'Medium', category: { nameEN: 'NEEDLE', nameAR: 'إبرة' } },
  { id: '394020ab-2d3e-4335-a351-06b60c9ec146', nameEN: 'OCTOPUS', nameAR: 'اخطبوط', sizeEN: 'Medium', category: { nameEN: 'OCTOPUS', nameAR: 'اخطبوط' } },
  { id: '9836940f-f3d8-4f8f-a6b3-cd56a6e64933', nameEN: 'PARROT', nameAR: 'بغبغاء', sizeEN: 'Medium', category: { nameEN: 'PARROT', nameAR: 'بغبغاء' } },
  { id: '16b80000-bf07-0a6e-2294-08dc46606e2b', nameEN: 'Pompano', nameAR: 'طلاح', sizeEN: 'Medium', category: { nameEN: 'BANBANU', nameAR: 'طلاح' } },
  { id: '16b80000-bf07-0a6e-555d-08dc39358b6e', nameEN: 'Qishran', nameAR: 'قشران', sizeEN: 'Medium', category: { nameEN: 'Qishran', nameAR: 'قشران' } },
  { id: '4a4682d0-8786-4373-bfb4-a750ab2662d4', nameEN: 'QUEEN Fish', nameAR: 'حبسة', sizeEN: 'Medium', category: { nameEN: 'QUEEN', nameAR: 'حبسة' } },
  { id: '1ac913b7-c031-4331-b43a-861ce497a611', nameEN: 'RED MULLET', nameAR: 'حرشة', sizeEN: 'Medium', category: { nameEN: 'RED MULLET', nameAR: 'حرشة' } },
  { id: '7c66aa97-3bf7-46d9-98f9-168f598f5695', nameEN: 'RED SEABREAM', nameAR: 'سيه', sizeEN: 'Small', category: { nameEN: 'RED SEABREAM', nameAR: 'سيا' } },
  { id: '52c00738-242d-403f-813f-00439ee91581', nameEN: 'RED SEABREAM', nameAR: 'سيه', sizeEN: 'Medium', category: { nameEN: 'RED SEABREAM', nameAR: 'سيا' } },
  { id: 'aa4a5d69-9e51-402b-968d-f2239f6817ae', nameEN: 'RED SEABREAM', nameAR: 'سيه', sizeEN: 'Large', category: { nameEN: 'RED SEABREAM', nameAR: 'سيا' } },
  { id: 'a0952560-3a38-454c-90b9-bce9c8167cb1', nameEN: 'ROHU', nameAR: 'روهو', sizeEN: 'Medium', category: { nameEN: 'RUHO', nameAR: 'روهو' } },
  { id: '55c3ba23-cb5d-405c-a50a-3bd41382623b', nameEN: 'SAAFI', nameAR: 'صافي', sizeEN: 'Medium', category: { nameEN: 'SAAFI', nameAR: 'صافي' } },
  { id: '16b80000-bf07-0a6e-f682-08dc50c28e00', nameEN: 'Sadah Tuna', nameAR: 'صده', sizeEN: 'Medium', category: { nameEN: 'Sadah Tuna', nameAR: 'صده' } },
  { id: '0f98b953-595b-48d5-b93c-87b6fd0aa7c7', nameEN: 'SAIL', nameAR: 'سنسول', sizeEN: 'Medium', category: { nameEN: 'SAIL', nameAR: 'سنسول' } },
  { id: '4be54955-dc0c-4f61-bea9-3c2a83092d1c', nameEN: 'SALMON', nameAR: 'سلمون', sizeEN: 'Medium', category: { nameEN: 'SALMON', nameAR: 'سلمون' } },
  { id: '16b80000-bf07-0a6e-9849-08dc46678d96', nameEN: 'SAMAN', nameAR: 'سمان', sizeEN: 'Medium', category: { nameEN: 'SAMAN', nameAR: 'سمان' } },
  { id: '651353e8-4b7b-4df2-b20c-1a11217d93e2', nameEN: 'SARDINES', nameAR: 'عومة', sizeEN: 'Medium', category: { nameEN: 'SARDINES', nameAR: 'عومة' } },
  { id: '16b80000-bf07-0a6e-c076-08dde5558303', nameEN: 'seabass', nameAR: 'سيباس', sizeEN: 'Medium', category: { nameEN: 'seabass', nameAR: 'سيباس' } },
  { id: '283faf52-004d-4506-b46b-ae65bc944b73', nameEN: 'SEABREAM', nameAR: 'سبريم', sizeEN: 'Medium', category: { nameEN: 'SEABREAM', nameAR: 'سبريم' } },
  { id: '3c078fa2-85ba-479d-acee-3cd25d753674', nameEN: 'SEEMA', nameAR: 'صيمة', sizeEN: 'Medium', category: { nameEN: 'SEEMA', nameAR: 'صيمة' } },
  { id: '16b80000-bf07-0a6e-3795-08dc2eb4d50a', nameEN: 'Shark', nameAR: 'جرجور', sizeEN: 'Medium', category: { nameEN: 'SHARK', nameAR: 'جرجور' } },
  { id: '86bc1df8-fc3e-4ce4-8d06-1a4854abcdf7', nameEN: 'SHARRY', nameAR: 'شعري', sizeEN: 'Medium', category: { nameEN: 'SHARRY', nameAR: 'شعري' } },
  { id: '9f3998e2-8735-4ecf-ae3b-9d2dcbb3d944', nameEN: 'SHARRY', nameAR: 'شعري', sizeEN: 'Large', category: { nameEN: 'SHARRY', nameAR: 'شعري' } },
  { id: '4e22b3fa-3955-4424-8659-9e2c3bb347c1', nameEN: 'SHARRY', nameAR: 'شعري', sizeEN: 'Small', category: { nameEN: 'SHARRY', nameAR: 'شعري' } },
  { id: '16b80000-bf07-0a6e-c0e3-08dc61db240c', nameEN: 'SHRIMPS', nameAR: 'ربيان', sizeEN: '0', category: { nameEN: 'SHRIMPS', nameAR: 'ربيان' } },
  { id: 'd05cc6a4-5687-43c1-9ac6-52c11c505865', nameEN: 'SILVER BREAM', nameAR: 'كوفر أبيض', sizeEN: 'Medium', category: { nameEN: 'SILVER BREAM', nameAR: 'شعم' } },
  { id: '355717da-2823-4d90-81e2-f6a6a13fb8ac', nameEN: 'SILVER BREAM', nameAR: 'كوفر أبيض', sizeEN: 'Large', category: { nameEN: 'SILVER BREAM', nameAR: 'شعم' } },
  { id: 'c7e16e68-a1d9-407a-85cc-7dee0c480a93', nameEN: 'SILVER BREAM', nameAR: 'كوفر أبيض', sizeEN: 'Small', category: { nameEN: 'SILVER BREAM', nameAR: 'شعم' } },
  { id: 'dca03c50-4485-4320-94cc-12a7231aea54', nameEN: 'SQUID', nameAR: 'حبار', sizeEN: 'Medium', category: { nameEN: 'SQUID', nameAR: 'حبار' } },
  { id: 'b4a4c520-d80e-4386-92f7-b52062e8b3e8', nameEN: 'SULTAN IBRAHIM', nameAR: 'سلطان إبراهيم', sizeEN: 'Medium', category: { nameEN: 'SULTAN IBRAHIM', nameAR: 'سلطان إبراهيم' } },
  { id: '16b80000-bf07-0a6e-a773-08dd55a8e81b', nameEN: 'Sweet Lips', nameAR: 'خناي / خشام', sizeEN: 'large', category: { nameEN: 'Sweet lips', nameAR: 'خناي/خشام' } },
  { id: '16b80000-bf07-0a6e-ffab-08dc3158b1b9', nameEN: 'Sweet Lips', nameAR: 'خناي/خشام', sizeEN: 'Medium', category: { nameEN: 'Sweet lips', nameAR: 'خناي/خشام' } },
  { id: '16b80000-bf07-0a6e-5370-08dd55a91126', nameEN: 'Sweet Lips', nameAR: 'خناي / خشام', sizeEN: 'Small', category: { nameEN: 'Sweet lips', nameAR: 'خناي/خشام' } },
  { id: 'a35dd6a7-767f-4bb0-92be-8a8270e78a0e', nameEN: 'TILAPIA', nameAR: 'بلطي', sizeEN: 'Medium', category: { nameEN: 'TILAPIA', nameAR: 'بلطي/مشط' } },
  { id: '74523fb0-05e6-4ca1-8875-8950a90149c3', nameEN: 'TREVALLY', nameAR: 'صال', sizeEN: 'Medium', category: { nameEN: 'TREVALLY', nameAR: 'صال' } },
  { id: '16b80000-bf07-0a6e-ecd1-08dc2e3a218b', nameEN: 'Yellow Fin Tuna', nameAR: 'جيذر', sizeEN: 'Larg', category: { nameEN: 'Yellow Fin Tuna', nameAR: 'جيذر' } },
  { id: '16b80000-bf07-0a6e-c204-08dc2e39f947', nameEN: 'Yellow Fin Tuna', nameAR: 'جيذر', sizeEN: 'Medium', category: { nameEN: 'Yellow Fin Tuna', nameAR: 'جيذر' } },
  { id: '16b80000-bf07-0a6e-5807-08dc2e3a4a06', nameEN: 'Yellow Fin Tuna “Madod”', nameAR: '"جيذر "معدود', sizeEN: 'small', category: { nameEN: 'Yellow Fin Tuna', nameAR: 'جيذر' } },
  { id: 'c5c48fce-77b0-46d5-9b1d-9dddafba1442', nameEN: 'YELLOWTAIL SCAD', nameAR: 'الذيل الاصفر', sizeEN: 'Medium', category: { nameEN: 'YELLOWTAIL SCAD', nameAR: 'الذيل الاصفر' } },
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

// Build the catalog from product records shaped like the products API: { id, nameEN, nameAR, sizeEN,
// category: { nameEN, nameAR } }. Returns the fish (each with its sizes), a name resolver and the prompt text.
export function buildCatalog(products) {
  // One entry per fish, holding its sizes (products).
  const FISH = [];
  for (const { id, nameEN, nameAR, sizeEN, category: { nameEN: categoryEN, nameAR: categoryAR } } of products) {
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
  function resolveFish(...names) {
    for (const name of names.filter(Boolean)) {
      const hits = INDEX.get(norm(name)) || INDEX.get(norm(String(name).replace(SIZE_WORDS, ' '))) || [];
      const fishes = [...new Set(hits.map((h) => h.fish))];
      if (fishes.length === 1) return { fish: fishes[0], size: hits.find((h) => h.size)?.size || null };
      if (fishes.length > 1) return { candidates: fishes };
    }
    return null;
  }

  // The list as the model sees it: one line per fish with its Arabic names and sizes.
  const catalogText = FISH.map((f) => {
    const aliases = f.enAliases.length ? ` (also ${f.enAliases.join(', ')})` : '';
    const sizes = f.products.filter((p) => p.size).map((p) => p.size + (p.sizeNames.length ? ` = ${p.sizeNames.join(', ')}` : ''));
    return `- ${f.name}${aliases}: ${f.arNames.join(', ')}${sizes.length > 1 || (sizes.length === 1 && sizes[0] !== 'Medium') ? ` [sizes: ${sizes.join('; ')}]` : ''}`;
  }).join('\n');

  return { fish: FISH, resolveFish, catalogText };
}

// The demo's catalog, from the product list above.
export const catalog = buildCatalog(PRODUCTS);
