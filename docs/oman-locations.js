// Oman's 11 governorates and 63 wilayats. Names: Wikipedia "Provinces of Oman" (2022 census list).
// Coordinates are approximate wilayat centres from Wikipedia and OpenStreetMap.

export const GOVERNORATES = [
  { en: "Muscat", ar: "مسقط", aka: [] },
  { en: "Dhofar", ar: "ظفار", aka: [] },
  { en: "Musandam", ar: "مسندم", aka: [] },
  { en: "Al Buraimi", ar: "البريمي", aka: ["Buraimi"] },
  { en: "Ad Dakhiliyah", ar: "الداخلية", aka: ["Dakhiliyah", "Interior"] },
  { en: "Ad Dhahirah", ar: "الظاهرة", aka: ["Dhahirah"] },
  { en: "Al Batinah North", ar: "شمال الباطنة", aka: ["North Batinah", "Batinah North"] },
  { en: "Al Batinah South", ar: "جنوب الباطنة", aka: ["South Batinah", "Batinah South"] },
  { en: "Ash Sharqiyah North", ar: "شمال الشرقية", aka: ["North Sharqiyah", "Sharqiyah North"] },
  { en: "Ash Sharqiyah South", ar: "جنوب الشرقية", aka: ["South Sharqiyah", "Sharqiyah South"] },
  { en: "Al Wusta", ar: "الوسطى", aka: ["Wusta"] },
];

export const WILAYATS = [
  { en: "Muscat", ar: "مسقط", governorate: "Muscat", lat: 23.5889, lng: 58.4083, aka: ["Masqat"] },
  { en: "Muttrah", ar: "مطرح", governorate: "Muscat", lat: 23.6167, lng: 58.5667, aka: ["Mutrah", "Matrah"] },
  { en: "Bawshar", ar: "بوشر", governorate: "Muscat", lat: 23.5333, lng: 58.3833, aka: ["Bausher", "Bowsher"] },
  { en: "As Seeb", ar: "السيب", governorate: "Muscat", lat: 23.6803, lng: 58.1825, aka: ["Seeb", "Al Seeb"] },
  { en: "Al Amarat", ar: "العامرات", governorate: "Muscat", lat: 23.5242, lng: 58.4989, aka: ["Al Amerat", "Amerat", "Amarat", "Al Amrat"] },
  { en: "Qurayyat", ar: "قريات", governorate: "Muscat", lat: 23.32, lng: 58.908, aka: ["Quriyat", "Qurayat"] },
  { en: "Salalah", ar: "صلالة", governorate: "Dhofar", lat: 17.0197, lng: 54.0897, aka: [] },
  { en: "Taqah", ar: "طاقة", governorate: "Dhofar", lat: 17.0372, lng: 54.4036, aka: [] },
  { en: "Mirbat", ar: "مرباط", governorate: "Dhofar", lat: 16.9886, lng: 54.6922, aka: ["Murbat"] },
  { en: "Thumrait", ar: "ثمريت", governorate: "Dhofar", lat: 17.6669, lng: 54.0328, aka: ["Thamarit"] },
  { en: "Sadah", ar: "سدح", governorate: "Dhofar", lat: 17.053, lng: 55.065, aka: ["Sadh"] },
  { en: "Rakhyut", ar: "رخيوت", governorate: "Dhofar", lat: 16.75, lng: 53.4167, aka: [] },
  { en: "Dhalkut", ar: "ضلكوت", governorate: "Dhofar", lat: 16.7058, lng: 53.1842, aka: [] },
  { en: "Muqshin", ar: "مقشن", governorate: "Dhofar", lat: 19.2969, lng: 54.775, aka: [] },
  { en: "Shalim and the Hallaniyat Islands", ar: "شليم وجزر الحلانيات", governorate: "Dhofar", lat: 18.1073, lng: 55.6501, aka: ["Shalim", "Hallaniyat"] },
  { en: "Al Mazyunah", ar: "المزيونة", governorate: "Dhofar", lat: 17.8486, lng: 52.62, aka: ["Al Mazyona", "Mazyona", "Mazyunah"] },
  { en: "Khasab", ar: "خصب", governorate: "Musandam", lat: 26.1841, lng: 56.247, aka: [] },
  { en: "Dibba", ar: "دبا", governorate: "Musandam", lat: 25.64, lng: 56.2667, aka: ["Daba", "Dibba Al Baya"] },
  { en: "Bukha", ar: "بخا", governorate: "Musandam", lat: 26.1431, lng: 56.1531, aka: [] },
  { en: "Madha", ar: "مدحاء", governorate: "Musandam", lat: 25.2844, lng: 56.3331, aka: [] },
  { en: "Al Buraimi", ar: "البريمي", governorate: "Al Buraimi", lat: 24.2592, lng: 55.7839, aka: ["Buraimi"] },
  { en: "Mahdah", ar: "محضة", governorate: "Al Buraimi", lat: 24.4033, lng: 55.9632, aka: ["Mahda"] },
  { en: "As Sunaynah", ar: "السنينة", governorate: "Al Buraimi", lat: 23.6, lng: 55.9667, aka: ["Sunaynah", "Al Sunainah"] },
  { en: "Nizwa", ar: "نزوى", governorate: "Ad Dakhiliyah", lat: 22.9333, lng: 57.5333, aka: [] },
  { en: "Bahla", ar: "بهلا", governorate: "Ad Dakhiliyah", lat: 22.968, lng: 57.298, aka: [] },
  { en: "Samail", ar: "سمائل", governorate: "Ad Dakhiliyah", lat: 23.3, lng: 57.9833, aka: ["Sumail", "Semail"] },
  { en: "Izki", ar: "إزكي", governorate: "Ad Dakhiliyah", lat: 22.9372, lng: 57.7571, aka: [] },
  { en: "Bidbid", ar: "بدبد", governorate: "Ad Dakhiliyah", lat: 23.4131, lng: 58.1242, aka: [] },
  { en: "Adam", ar: "أدم", governorate: "Ad Dakhiliyah", lat: 22.3833, lng: 57.5333, aka: [] },
  { en: "Al Hamra", ar: "الحمراء", governorate: "Ad Dakhiliyah", lat: 23.1167, lng: 57.2931, aka: ["Hamra"] },
  { en: "Manah", ar: "منح", governorate: "Ad Dakhiliyah", lat: 22.791, lng: 57.587, aka: [] },
  { en: "Al Jabal Al Akhdar", ar: "الجبل الأخضر", governorate: "Ad Dakhiliyah", lat: 23.1, lng: 57.4, aka: ["Jebel Akhdar", "Jabal Akhdar", "Green Mountain"] },
  { en: "Ibri", ar: "عبري", governorate: "Ad Dhahirah", lat: 23.2364, lng: 56.5044, aka: [] },
  { en: "Yanqul", ar: "ينقل", governorate: "Ad Dhahirah", lat: 23.5913, lng: 56.5547, aka: [] },
  { en: "Dhank", ar: "ضنك", governorate: "Ad Dhahirah", lat: 23.55, lng: 56.25, aka: [] },
  { en: "Sohar", ar: "صحار", governorate: "Al Batinah North", lat: 24.342, lng: 56.7298, aka: ["Suhar"] },
  { en: "As Suwaiq", ar: "السويق", governorate: "Al Batinah North", lat: 23.8244, lng: 57.4238, aka: ["Suwaiq", "Al Suwaiq", "Suwayq"] },
  { en: "Saham", ar: "صحم", governorate: "Al Batinah North", lat: 24.1722, lng: 56.8886, aka: ["Sahm"] },
  { en: "Al Khaburah", ar: "الخابورة", governorate: "Al Batinah North", lat: 23.9709, lng: 57.0911, aka: ["Khaburah", "Al Khabourah"] },
  { en: "Shinas", ar: "شناص", governorate: "Al Batinah North", lat: 24.75, lng: 56.4667, aka: [] },
  { en: "Liwa", ar: "لوى", governorate: "Al Batinah North", lat: 24.51, lng: 56.57, aka: [] },
  { en: "Barka", ar: "بركاء", governorate: "Al Batinah South", lat: 23.6964, lng: 57.8878, aka: ["Barkaa"] },
  { en: "Ar Rustaq", ar: "الرستاق", governorate: "Al Batinah South", lat: 23.3908, lng: 57.4244, aka: ["Rustaq", "Al Rustaq"] },
  { en: "Al Musanaah", ar: "المصنعة", governorate: "Al Batinah South", lat: 23.7396, lng: 57.6454, aka: ["Musanaah", "Al Musannah", "Al Masnaah"] },
  { en: "Nakhal", ar: "نخل", governorate: "Al Batinah South", lat: 23.3955, lng: 57.8289, aka: ["Nakhl"] },
  { en: "Wadi Al Maawil", ar: "وادي المعاول", governorate: "Al Batinah South", lat: 23.4455, lng: 57.8093, aka: ["Wadi Maawil"] },
  { en: "Al Awabi", ar: "العوابي", governorate: "Al Batinah South", lat: 23.2931, lng: 57.5583, aka: ["Awabi"] },
  { en: "Al Mudhaibi", ar: "المضيبي", governorate: "Ash Sharqiyah North", lat: 22.5667, lng: 58.1167, aka: ["Mudhaibi", "Al Mudaybi"] },
  { en: "Ibra", ar: "إبراء", governorate: "Ash Sharqiyah North", lat: 22.6833, lng: 58.55, aka: [] },
  { en: "Bidiyah", ar: "بدية", governorate: "Ash Sharqiyah North", lat: 22.44, lng: 58.8, aka: ["Bidiya", "Bidiyya", "Badiyah"] },
  { en: "Sinaw", ar: "سناو", governorate: "Ash Sharqiyah North", lat: 22.5156, lng: 58.0332, aka: [] },
  { en: "Dima Wa At Taiyyin", ar: "دماء والطائيين", governorate: "Ash Sharqiyah North", lat: 23.034, lng: 58.509, aka: ["Dema Wa Thaieen", "Dima wa Al Taiyin"] },
  { en: "Al Qabil", ar: "القابل", governorate: "Ash Sharqiyah North", lat: 22.5667, lng: 58.6833, aka: ["Qabil"] },
  { en: "Wadi Bani Khalid", ar: "وادي بني خالد", governorate: "Ash Sharqiyah North", lat: 22.6545, lng: 58.9904, aka: ["Wadi Bani Khaled"] },
  { en: "Sur", ar: "صور", governorate: "Ash Sharqiyah South", lat: 22.5667, lng: 59.5289, aka: [] },
  { en: "Jaalan Bani Bu Ali", ar: "جعلان بني بو علي", governorate: "Ash Sharqiyah South", lat: 22.0133, lng: 59.2058, aka: ["Jalan Bani Bu Ali"] },
  { en: "Jaalan Bani Bu Hassan", ar: "جعلان بني بو حسن", governorate: "Ash Sharqiyah South", lat: 22.0819, lng: 59.279, aka: ["Jalan Bani Bu Hassan"] },
  { en: "Al Kamil Wal Wafi", ar: "الكامل والوافي", governorate: "Ash Sharqiyah South", lat: 22.2201, lng: 59.2001, aka: ["Al Kamil", "Kamil"] },
  { en: "Masirah", ar: "مصيرة", governorate: "Ash Sharqiyah South", lat: 20.4711, lng: 58.8153, aka: ["Masira"] },
  { en: "Ad Duqm", ar: "الدقم", governorate: "Al Wusta", lat: 19.6617, lng: 57.7047, aka: ["Duqm", "Al Duqm"] },
  { en: "Mahout", ar: "محوت", governorate: "Al Wusta", lat: 20.7614, lng: 58.2894, aka: ["Mahoot", "Mahut"] },
  { en: "Haima", ar: "هيما", governorate: "Al Wusta", lat: 19.9569, lng: 56.2758, aka: ["Haymaa", "Hayma"] },
  { en: "Al Jazer", ar: "الجازر", governorate: "Al Wusta", lat: 18.5833, lng: 56.5833, aka: ["Al Jazir", "Jazer"] },
];

// Loose match: case, spacing, hyphens, the Arabic/English article and common Arabic letter variants are ignored.
function norm(s) {
  return String(s || '').toLowerCase().trim()
    .replace(/^(ولاية|محافظة)\s+/, '').replace(/^(wilayat|governorate of)\s+/, '').replace(/\s+(governorate|wilayat)$/, '')
    .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
    .replace(/(^|\s)ال/g, '$1').replace(/(^|\s)(al|as|ar|ad|ash|an|at)[\s-]+/g, '$1')
    .replace(/[\s\-'’`]/g, '');
}

const matches = (place, name) => [place.en, place.ar, ...place.aka].some((n) => norm(n) === norm(name));

// Resolve a place to { governorate, wilayat, Arabic names, lat, lng }. A wilayat always fixes its
// governorate. A governorate with a wilayat of the same name (Muscat, Al Buraimi) means both.
export function resolveLocation({ wilayat, governorate, spoken } = {}) {
  for (const name of [wilayat, spoken].filter(Boolean)) {
    const w = WILAYATS.find((p) => matches(p, name));
    if (w) return withGovernorate(w);
  }
  for (const name of [governorate, spoken].filter(Boolean)) {
    const g = GOVERNORATES.find((p) => matches(p, name));
    if (g) {
      const sameName = WILAYATS.find((w) => w.governorate === g.en && norm(w.en) === norm(g.en));
      return sameName ? withGovernorate(sameName) : { governorate: g.en, governorateAr: g.ar, wilayat: null, wilayatAr: null, lat: null, lng: null };
    }
  }
  return null;
}

function withGovernorate(w) {
  const g = GOVERNORATES.find((p) => p.en === w.governorate);
  return { governorate: g.en, governorateAr: g.ar, wilayat: w.en, wilayatAr: w.ar, lat: w.lat, lng: w.lng };
}

// Compact list for the model's prompt: one line per governorate.
export const GAZETTEER_TEXT = GOVERNORATES.map((g) =>
  `${g.en} (${g.ar}): ` + WILAYATS.filter((w) => w.governorate === g.en).map((w) => `${w.en} (${w.ar})`).join(', ')
).join('\n');
