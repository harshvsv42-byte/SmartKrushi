/**
 * Central dynamic data localization helper for backend values
 * (soil types, textures, nutrients, districts, crops, seasons, weather, timelines, dates,
 *  and phonetic English -> Gujarati/Hindi transliteration for user names & addresses).
 */

export const normalizeLang = (lang) => {
  const code = (lang || 'gu').toLowerCase().split('-')[0];
  return code === 'hi' || code === 'en' ? code : 'gu';
};

const pick = (entry, lang) => {
  if (!entry) return null;
  const l = normalizeLang(lang);
  return entry[l] || entry.gu || entry.en;
};

const LOCATION_MAP = {
  gujarat: { gu: 'ગુજરાત', hi: 'गुजरात', en: 'Gujarat' },
  india: { gu: 'ભારત', hi: 'भारत', en: 'India' },
  ahmedabad: { gu: 'અમદાવાદ', hi: 'अहमदाबाद', en: 'Ahmedabad' },
  rajkot: { gu: 'રાજકોટ', hi: 'राजकोट', en: 'Rajkot' },
  surat: { gu: 'સુરત', hi: 'सूरत', en: 'Surat' },
  vadodara: { gu: 'વડોદરા', hi: 'वडोदरा', en: 'Vadodara' },
  baroda: { gu: 'વડોદરા', hi: 'वडोदरा', en: 'Baroda' },
  mehsana: { gu: 'મહેસાણા', hi: 'मेहसाणा', en: 'Mehsana' },
  valsad: { gu: 'વલસાડ', hi: 'वलसाड', en: 'Valsad' },
  anand: { gu: 'આણંદ', hi: 'आणंद', en: 'Anand' },
  junagadh: { gu: 'જૂનાગઢ', hi: 'जूनागढ़', en: 'Junagadh' },
  bhavnagar: { gu: 'ભાવનગર', hi: 'भावनगर', en: 'Bhavnagar' },
  amreli: { gu: 'અમરેલી', hi: 'अमरेली', en: 'Amreli' },
  jamnagar: { gu: 'જામનગર', hi: 'जामनगर', en: 'Jamnagar' },
  morbi: { gu: 'મોરબી', hi: 'मोरबी', en: 'Morbi' },
  patan: { gu: 'પાટણ', hi: 'पाटन', en: 'Patan' },
  banaskantha: { gu: 'બનાસકાંઠા', hi: 'बनासकांठा', en: 'Banaskantha' },
  sabarkantha: { gu: 'સાબરકાંઠા', hi: 'साबरकांठा', en: 'Sabarkantha' },
  dahod: { gu: 'દાહોદ', hi: 'दाहोद', en: 'Dahod' },
  gandhinagar: { gu: 'ગાંધીનગર', hi: 'गांधीनगर', en: 'Gandhinagar' },
  kutch: { gu: 'કચ્છ', hi: 'कच्छ', en: 'Kutch' },
  bharuch: { gu: 'ભરૂચ', hi: 'भरूच', en: 'Bharuch' },
  navsari: { gu: 'નવસારી', hi: 'नवसारी', en: 'Navsari' },
  surendranagar: { gu: 'સુરેન્દ્રનગર', hi: 'सुरेंद्रनगर', en: 'Surendranagar' },
  porbandar: { gu: 'પોરબંદર', hi: 'पोरबंदर', en: 'Porbandar' },
  kheda: { gu: 'ખેડા', hi: 'खेड़ा', en: 'Kheda' },
  panchmahal: { gu: 'પંચમહાલ', hi: 'पंचमहल', en: 'Panchmahal' },
  botad: { gu: 'બોટાદ', hi: 'बोटाद', en: 'Botad' },
  narmada: { gu: 'નર્મદા', hi: 'नर्मदा', en: 'Narmada' },
  tapi: { gu: 'તાપી', hi: 'तापी', en: 'Tapi' },
  dang: { gu: 'ડાંગ', hi: 'डांग', en: 'Dang' },
  aravalli: { gu: 'અરવલ્લી', hi: 'अरावली', en: 'Aravalli' },
  mahisagar: { gu: 'મહીસાગર', hi: 'महीसागर', en: 'Mahisagar' },
  gir: { gu: 'ગીર', hi: 'गिर', en: 'Gir' },
  somnath: { gu: 'સોમનાથ', hi: 'सोमनाथ', en: 'Somnath' },
  dwarka: { gu: 'દ્વારકા', hi: 'द्वारका', en: 'Dwarka' },
  // Popular talukas & towns
  gondal: { gu: 'ગોંડલ', hi: 'गोंडल', en: 'Gondal' },
  unjha: { gu: 'ઊંઝા', hi: 'ऊंझा', en: 'Unjha' },
  mahuva: { gu: 'મહુવા', hi: 'महुवा', en: 'Mahuva' },
  deesa: { gu: 'ડીસા', hi: 'डीसा', en: 'Deesa' },
  himmatnagar: { gu: 'હિંમતનગર', hi: 'हिम्मतनगर', en: 'Himmatnagar' },
  daskroi: { gu: 'દસક્રોઈ', hi: 'दसक्रोई', en: 'Daskroi' },
  sanand: { gu: 'સાણંદ', hi: 'साणंद', en: 'Sanand' },
  bavla: { gu: 'બાવળા', hi: 'बावला', en: 'Bavla' },
  dholka: { gu: 'ધોળકા', hi: 'धोलका', en: 'Dholka' },
  viramgam: { gu: 'વિરમગામ', hi: 'विरमगाम', en: 'Viramgam' },
  bopal: { gu: 'બોપલ', hi: 'बोपल', en: 'Bopal' },
  changodar: { gu: 'ચાંગોદર', hi: 'चांगोदर', en: 'Changodar' },
  jetpur: { gu: 'જેતપુર', hi: 'जेतपुर', en: 'Jetpur' },
  dhoraji: { gu: 'ધોરાજી', hi: 'धोराजी', en: 'Dhoraji' },
  upleta: { gu: 'ઉપલેટા', hi: 'उपलेटा', en: 'Upleta' },
  jasdan: { gu: 'જસદણ', hi: 'जसदण', en: 'Jasdan' },
  bardoli: { gu: 'બારડોલી', hi: 'बारडोली', en: 'Bardoli' },
  kamrej: { gu: 'કામરેજ', hi: 'कामरेज', en: 'Kamrej' },
  olpad: { gu: 'ઓલપાડ', hi: 'ओलपाड', en: 'Olpad' },
  padra: { gu: 'પાદરા', hi: 'पादरा', en: 'Padra' },
  karjan: { gu: 'કરજણ', hi: 'करजण', en: 'Karjan' },
  dabhoi: { gu: 'ડભોઈ', hi: 'डभोई', en: 'Dabhoi' },
  pardi: { gu: 'પારડી', hi: 'पारडी', en: 'Pardi' },
  umbergaon: { gu: 'ઉમરગામ', hi: 'उमरगाम', en: 'Umbergaon' },
  dharampur: { gu: 'ધરમપુર', hi: 'धरमपुर', en: 'Dharampur' },
};

const SOIL_TYPE_MAP = {
  black: { gu: 'કાળી', hi: 'काली', en: 'Black' },
  'medium black': { gu: 'મધ્યમ કાળી', hi: 'मध्यम काली', en: 'Medium Black' },
  'deep black': { gu: 'ઊંડી કાળી', hi: 'गहरी काली', en: 'Deep Black' },
  'sandy loam': { gu: 'રેતાળ ગોરાડુ', hi: 'रेतीली दोमट', en: 'Sandy Loam' },
  alluvial: { gu: 'કાંપની', hi: 'जलोढ़', en: 'Alluvial' },
  red: { gu: 'લાલ', hi: 'लाल', en: 'Red' },
  clay: { gu: 'ચીકણી', hi: 'चिकनी', en: 'Clay' },
  loamy: { gu: 'ગોરાડુ', hi: 'दोमट', en: 'Loamy' },
  sandy: { gu: 'રેતાળ', hi: 'रेतीली', en: 'Sandy' },
};

const SOIL_TEXTURE_MAP = {
  'clay loam': { gu: 'ચીકણી ગોરાડુ', hi: 'चिकनी दोमट', en: 'Clay Loam' },
  clayey: { gu: 'ચીકણી માટી', hi: 'चिकनी मिट्टी', en: 'Clayey' },
  'sandy loam': { gu: 'રેતાળ ગોરાડુ', hi: 'रेतीली दोमट', en: 'Sandy Loam' },
  'sandy clay loam': { gu: 'રેતાળ ચીકણી ગોરાડુ', hi: 'रेतीली चिकनी दोमट', en: 'Sandy Clay Loam' },
  'heavy clay': { gu: 'ભારે ચીકણી', hi: 'भारी चिकनी', en: 'Heavy Clay' },
  loam: { gu: 'ગોરાડુ', hi: 'दोमट', en: 'Loam' },
  'silty loam': { gu: 'કાંપવાળી ગોરાડુ', hi: 'गाद दोमट', en: 'Silty Loam' },
};

const STATUS_MAP = {
  low: { gu: 'ઓછું', hi: 'कम', en: 'Low' },
  medium: { gu: 'મધ્યમ', hi: 'मध्यम', en: 'Medium' },
  high: { gu: 'વધુ', hi: 'अधिक', en: 'High' },
  optimal: { gu: 'ઉત્તમ', hi: 'उत्तम', en: 'Optimal' },
  good: { gu: 'સારું', hi: 'अच्छा', en: 'Good' },
  deficient: { gu: 'ઊણપ', hi: 'कमी', en: 'Deficient' },
  sufficient: { gu: 'પૂરતું', hi: 'पर्याप्त', en: 'Sufficient' },
  normal: { gu: 'સામાન્ય', hi: 'सामान्य', en: 'Normal' },
  neutral: { gu: 'તટસ્થ', hi: 'तटस्थ', en: 'Neutral' },
  'neutral / optimal': { gu: 'તટસ્થ / ઉત્તમ', hi: 'तटस्थ / उत्तम', en: 'Neutral / Optimal' },
  'slightly alkaline': { gu: 'થોડી ક્ષારીય', hi: 'हल्की क्षारीय', en: 'Slightly Alkaline' },
  'moderately alkaline': { gu: 'મધ્યમ ક્ષારીય', hi: 'मध्यम क्षारीय', en: 'Moderately Alkaline' },
  'slightly acidic': { gu: 'થોડી અમ્લીય', hi: 'हल्की अम्लीय', en: 'Slightly Acidic' },
  'moderately acidic': { gu: 'મધ્યમ અમ્લીય', hi: 'मध्यम अम्लीय', en: 'Moderately Acidic' },
  'medium to high': { gu: 'મધ્યમ થી ઉચ્ચ', hi: 'मध्यम से उच्च', en: 'Medium to High' },
  moderate: { gu: 'મધ્યમ', hi: 'मध्यम', en: 'Moderate' },
};

const WEATHER_MAP = {
  'clear sky': { gu: 'સાફ આકાશ', hi: 'साफ आसमान', en: 'Clear sky' },
  'mainly clear': { gu: 'મુખ્યત્વે સાફ', hi: 'मुख्यतः साफ', en: 'Mainly clear' },
  'partly cloudy': { gu: 'આંશિક વાદળછાયું', hi: 'आंशिक बादल', en: 'Partly cloudy' },
  overcast: { gu: 'વાદળછાયું', hi: 'घने बादल', en: 'Overcast' },
  fog: { gu: 'ધુમ્મસ', hi: 'कोहरा', en: 'Fog' },
  'depositing rime fog': { gu: 'ગાઢ ધુમ્મસ', hi: 'घना कोहरा', en: 'Depositing rime fog' },
  'light drizzle': { gu: 'હળવો ઝરમર વરસાદ', hi: 'हल्की बूंदाबांदी', en: 'Light drizzle' },
  'moderate drizzle': { gu: 'મધ્યમ ઝરમર વરસાદ', hi: 'मध्यम बूंदाबांदी', en: 'Moderate drizzle' },
  'dense drizzle': { gu: 'ભારે ઝરમર વરસાદ', hi: 'तेज़ बूंदाबांदी', en: 'Dense drizzle' },
  'slight rain': { gu: 'હળવો વરસાદ', hi: 'हल्की बारिश', en: 'Slight rain' },
  'light rain': { gu: 'હળવો વરસાદ', hi: 'हल्की बारिश', en: 'Light rain' },
  'moderate rain': { gu: 'મધ્યમ વરસાદ', hi: 'मध्यम बारिश', en: 'Moderate rain' },
  'heavy rain': { gu: 'ભારે વરસાદ', hi: 'भारी बारिश', en: 'Heavy rain' },
  'slight rain showers': { gu: 'હળવા વરસાદી ઝાપટા', hi: 'हल्की बौछारें', en: 'Slight rain showers' },
  'moderate rain showers': { gu: 'મધ્યમ વરસાદી ઝાપટા', hi: 'मध्यम बौछारें', en: 'Moderate rain showers' },
  'violent rain showers': { gu: 'ભારે વરસાદી ઝાપટા', hi: 'तेज़ बौछारें', en: 'Violent rain showers' },
  thunderstorm: { gu: 'ગાજવીજ સાથે વરસાદ', hi: 'आंधी-तूफान', en: 'Thunderstorm' },
  'unknown / variable': { gu: 'બદલાતું હવામાન', hi: 'परिवर्तनशील मौसम', en: 'Variable' },
};

const CROP_MAP = {
  cotton: { gu: 'કપાસ', hi: 'कपास', en: 'Cotton' },
  wheat: { gu: 'ઘઉં', hi: 'गेहूं', en: 'Wheat' },
  cumin: { gu: 'જીરું', hi: 'जीरा', en: 'Cumin' },
  groundnut: { gu: 'મગફળી', hi: 'मूंगफली', en: 'Groundnut' },
  peanut: { gu: 'મગફળી', hi: 'मूंगफली', en: 'Peanut' },
  castor: { gu: 'એરંડા', hi: 'अरंडी', en: 'Castor' },
  rice: { gu: 'ડાંગર (ચોખા)', hi: 'धान (चावल)', en: 'Rice' },
  paddy: { gu: 'ડાંગર', hi: 'धान', en: 'Paddy' },
  mustard: { gu: 'રાયડો', hi: 'सरसों', en: 'Mustard' },
  gram: { gu: 'ચણા', hi: 'चना', en: 'Gram' },
  chickpea: { gu: 'ચણા', hi: 'चना', en: 'Chickpea' },
  bajra: { gu: 'બાજરી', hi: 'बाजरा', en: 'Bajra' },
  'pearl millet': { gu: 'બાજરી', hi: 'बाजरा', en: 'Pearl Millet' },
  sesame: { gu: 'તલ', hi: 'तिल', en: 'Sesame' },
  onion: { gu: 'ડુંગળી', hi: 'प्याज', en: 'Onion' },
  potato: { gu: 'બટાટા', hi: 'आलू', en: 'Potato' },
  garlic: { gu: 'લસણ', hi: 'लहसुन', en: 'Garlic' },
  sugarcane: { gu: 'શેરડી', hi: 'गन्ना', en: 'Sugarcane' },
  fennel: { gu: 'વરિયાળી', hi: 'सौंफ', en: 'Fennel' },
  isabgul: { gu: 'ઈસબગુલ', hi: 'ईसबगोल', en: 'Isabgul' },
  moong: { gu: 'મગ', hi: 'मूंग', en: 'Moong' },
  'green gram': { gu: 'મગ', hi: 'मूंग', en: 'Green Gram' },
  tur: { gu: 'તુવેર', hi: 'अरहर (तूर)', en: 'Pigeon Pea' },
  'pigeon pea': { gu: 'તુવેર', hi: 'अरहर', en: 'Pigeon Pea' },
  mango: { gu: 'કેરી', hi: 'आम', en: 'Mango' },
  banana: { gu: 'કેળા', hi: 'केला', en: 'Banana' },
  tomato: { gu: 'ટામેટા', hi: 'टमाटर', en: 'Tomato' },
};

const SEASON_MAP = {
  kharif: { gu: 'ચોમાસુ (ખરીફ)', hi: 'खरीफ (मानसून)', en: 'Kharif Season' },
  rabi: { gu: 'શિયાળુ (રવિ)', hi: 'रबी (सर्दी)', en: 'Rabi Season' },
  zaid: { gu: 'ઉનાળુ (ઝાયદ)', hi: 'जायद (गर्मी)', en: 'Zaid / Summer Season' },
  summer: { gu: 'ઉનાળુ', hi: 'गर्मी', en: 'Summer' },
  winter: { gu: 'શિયાળુ', hi: 'सर्दी', en: 'Winter' },
  monsoon: { gu: 'ચોમાસુ', hi: 'मानसून', en: 'Monsoon' },
};

const CALENDAR_MONTH_RANGES = {
  kharif: { gu: 'જૂન થી ઓક્ટોબર', hi: 'जून से अक्टूबर', en: 'June - October' },
  rabi: { gu: 'ઓક્ટોબર થી માર્ચ', hi: 'अक्टूबर से मार्च', en: 'October - March' },
  zaid: { gu: 'ફેબ્રુઆરી થી મે', hi: 'फरवरी से मई', en: 'February - May' },
};

export const WEEKDAYS = {
  gu: ['રવિવાર', 'સોમવાર', 'મંગળવાર', 'બુધવાર', 'ગુરુવાર', 'શુક્રવાર', 'શનિવાર'],
  hi: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

export const MONTHS = {
  gu: [
    'જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન',
    'જુલાઈ', 'ઑગસ્ટ', 'સપ્ટેમ્બર', 'ઑક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર',
  ],
  hi: [
    'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर',
  ],
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
};

// ── Phonetic Latin -> Gujarati / Hindi Transliteration ─────────────────────
const SCRIPT_TABLES = {
  gu: {
    vowelsInd: { a: 'અ', aa: 'આ', i: 'ઇ', ee: 'ઈ', ii: 'ઈ', u: 'ઉ', oo: 'ઊ', uu: 'ઊ', e: 'એ', ai: 'ઐ', o: 'ઓ', au: 'ઔ', ou: 'ઔ' },
    vowelsMatra: { a: '', aa: 'ા', i: 'િ', ee: 'ી', ii: 'ી', u: 'ુ', oo: 'ૂ', uu: 'ૂ', e: 'ે', ai: 'ૈ', o: 'ો', au: 'ૌ', ou: 'ૌ' },
    consonants: {
      ksh: 'ક્ષ', gny: 'જ્ઞ', chh: 'છ',
      kh: 'ખ', gh: 'ઘ', ch: 'ચ', jh: 'ઝ', th: 'થ', dh: 'ધ', ph: 'ફ', bh: 'ભ', sh: 'શ',
      k: 'ક', g: 'ગ', c: 'ચ', j: 'જ', t: 'ત', d: 'દ', n: 'ન', p: 'પ', f: 'ફ', b: 'બ',
      m: 'મ', y: 'ય', r: 'ર', l: 'લ', v: 'વ', w: 'વ', s: 'સ', h: 'હ', z: 'ઝ', q: 'ક', x: 'ક્સ',
    },
    halant: '્',
    anusvara: 'ં',
  },
  hi: {
    vowelsInd: { a: 'अ', aa: 'आ', i: 'इ', ee: 'ई', ii: 'ई', u: 'उ', oo: 'ऊ', uu: 'ऊ', e: 'ए', ai: 'ऐ', o: 'ओ', au: 'औ', ou: 'औ' },
    vowelsMatra: { a: '', aa: 'ा', i: 'ि', ee: 'ी', ii: 'ी', u: 'ु', oo: 'ू', uu: 'ू', e: 'े', ai: 'ै', o: 'ो', au: 'ौ', ou: 'ौ' },
    consonants: {
      ksh: 'क्ष', gny: 'ज्ञ', chh: 'छ',
      kh: 'ख', gh: 'घ', ch: 'च', jh: 'झ', th: 'थ', dh: 'ध', ph: 'फ', bh: 'भ', sh: 'श',
      k: 'क', g: 'ग', c: 'च', j: 'ज', t: 'त', d: 'द', n: 'न', p: 'प', f: 'फ', b: 'ब',
      m: 'म', y: 'य', r: 'र', l: 'ल', v: 'व', w: 'व', s: 'स', h: 'ह', z: 'ज़', q: 'क', x: 'क्स',
    },
    halant: '्',
    anusvara: 'ं',
  },
};

const COMMON_WORDS_MAP = {
  patel: { gu: 'પટેલ', hi: 'पटेल' },
  shah: { gu: 'શાહ', hi: 'शाह' },
  mehta: { gu: 'મહેતા', hi: 'मेहता' },
  desai: { gu: 'દેસાઈ', hi: 'देसाई' },
  joshi: { gu: 'જોશી', hi: 'जोशी' },
  pandya: { gu: 'પંડ્યા', hi: 'पंड्या' },
  trivedi: { gu: 'ત્રિવેદી', hi: 'त्रिवेदी' },
  parmar: { gu: 'પરમાર', hi: 'परमार' },
  chauhan: { gu: 'ચૌહાણ', hi: 'चौहान' },
  jadeja: { gu: 'જાડેજા', hi: 'जाडेजा' },
  rathod: { gu: 'રાઠોડ', hi: 'राठौड़' },
  solanki: { gu: 'સોલંકી', hi: 'सोलंकी' },
  prajapati: { gu: 'પ્રજાપતિ', hi: 'प्रजापति' },
  chaudhary: { gu: 'ચૌધરી', hi: 'चौधरी' },
  vasava: { gu: 'વસાવા', hi: 'वसावा' },
  harsh: { gu: 'હર્ષ', hi: 'हर्ष' },
  kisan: { gu: 'કિસાન', hi: 'किसान' },
  farmer: { gu: 'ખેડૂત', hi: 'किसान' },
  village: { gu: 'ગામ', hi: 'गाँव' },
  nagar: { gu: 'નગર', hi: 'नगर' },
  pur: { gu: 'પુર', hi: 'पुर' },
  city: { gu: 'શહેર', hi: 'शहर' },
  rural: { gu: 'ગ્રામ્ય', hi: 'ग्रामीण' },
};

const transliterateSingleWord = (word, lang) => {
  const l = normalizeLang(lang);
  if (l === 'en' || !/[a-zA-Z]/.test(word)) return word;
  const lower = word.toLowerCase();

  // Check exact dictionaries first
  if (LOCATION_MAP[lower]?.[l]) return LOCATION_MAP[lower][l];
  if (COMMON_WORDS_MAP[lower]?.[l]) return COMMON_WORDS_MAP[lower][l];
  if (CROP_MAP[lower]?.[l]) return CROP_MAP[lower][l];

  const tbl = SCRIPT_TABLES[l];
  if (!tbl) return word;

  const consKeys = Object.keys(tbl.consonants).sort((a, b) => b.length - a.length);
  const vowelKeys = Object.keys(tbl.vowelsInd).sort((a, b) => b.length - a.length);

  let out = '';
  let idx = 0;
  let lastWasConsonant = false;

  while (idx < lower.length) {
    const rest = lower.slice(idx);

    // Non-ASCII / non-letter characters pass through
    if (!/^[a-z]/.test(rest)) {
      out += word[idx];
      idx += 1;
      lastWasConsonant = false;
      continue;
    }

    // Match vowel
    const vMatch = vowelKeys.find((v) => rest.startsWith(v));
    if (vMatch) {
      if (lastWasConsonant) {
        // Trailing 'a' at the end of a word in Indian names/places usually sounds like 'aa' (ા / ा)
        if (vMatch === 'a' && idx + 1 === lower.length && lower.length > 2) {
          out += tbl.vowelsMatra.aa;
        } else {
          out += tbl.vowelsMatra[vMatch];
        }
      } else {
        out += tbl.vowelsInd[vMatch];
      }
      idx += vMatch.length;
      lastWasConsonant = false;
      continue;
    }

    // Match consonant
    const cMatch = consKeys.find((c) => rest.startsWith(c));
    if (cMatch) {
      if (lastWasConsonant) {
        // Handle nasal 'n'/'m' before consonant nicely
        if (lower[idx - 1] === 'n' && cMatch !== 'n' && cMatch !== 'm') {
          out = out.slice(0, -1) + tbl.anusvara;
        } else {
          out += tbl.halant;
        }
      }
      out += tbl.consonants[cMatch];
      idx += cMatch.length;
      lastWasConsonant = true;
      continue;
    }

    idx += 1;
    lastWasConsonant = false;
  }

  return out || word;
};

/**
 * Translates or phonetically transliterates free-form English names & addresses
 * (e.g., farmer name, village, taluka) into Gujarati or Hindi.
 */
export const transliterateText = (value, lang) => {
  if (!value || typeof value !== 'string') return value;
  const l = normalizeLang(lang);
  if (l === 'en') return value;

  // Check full string match in Location / Common / Crop maps first
  const trimmedLower = value.trim().toLowerCase();
  if (LOCATION_MAP[trimmedLower]?.[l]) return LOCATION_MAP[trimmedLower][l];
  if (COMMON_WORDS_MAP[trimmedLower]?.[l]) return COMMON_WORDS_MAP[trimmedLower][l];

  // Replace Latin word tokens with transliterated Indic tokens
  return value.replace(/[A-Za-z]+/g, (token) => transliterateSingleWord(token, l));
};

export const translateLocation = (value, lang) => {
  if (!value || typeof value !== 'string') return value;
  const l = normalizeLang(lang);
  const key = value.trim().toLowerCase();
  if (LOCATION_MAP[key]) return pick(LOCATION_MAP[key], l);
  return l === 'en' ? value : transliterateText(value, l);
};

export const translateSoilType = (value, lang) => {
  if (!value || typeof value !== 'string') return value;
  const key = value.trim().toLowerCase().replace(/\s*soil$/i, '');
  return pick(SOIL_TYPE_MAP[key], lang) || value;
};

export const translateSoilTexture = (value, lang) => {
  if (!value || typeof value !== 'string') return value;
  const key = value.trim().toLowerCase();
  return pick(SOIL_TEXTURE_MAP[key], lang) || value;
};

export const translateStatus = (value, lang) => {
  if (!value || typeof value !== 'string') return value;
  const key = value.trim().toLowerCase();
  if (STATUS_MAP[key]) return pick(STATUS_MAP[key], lang);
  const firstWord = key.split(/[\s(]/)[0];
  if (STATUS_MAP[firstWord]) return pick(STATUS_MAP[firstWord], lang);
  return value;
};

export const translateWeatherCondition = (value, lang) => {
  if (!value || typeof value !== 'string') return value;
  const key = value.trim().toLowerCase();
  return pick(WEATHER_MAP[key], lang) || value;
};

export const translateCropName = (value, lang) => {
  if (!value || typeof value !== 'string') return value;
  const l = normalizeLang(lang);
  if (value.includes(',')) {
    return value
      .split(',')
      .map((part) => translateCropName(part.trim(), l))
      .join(', ');
  }
  const key = value.trim().toLowerCase();
  if (CROP_MAP[key]) return pick(CROP_MAP[key], l);
  return l === 'en' ? value : transliterateText(value, l);
};

export const translateSeason = (value, lang) => {
  if (!value || typeof value !== 'string') return value;
  const lower = value.toLowerCase();
  if (lower.includes('kharif') || lower.includes('ચોમાસુ')) return pick(SEASON_MAP.kharif, lang);
  if (lower.includes('rabi') || lower.includes('શિયાળુ')) return pick(SEASON_MAP.rabi, lang);
  if (lower.includes('zaid') || lower.includes('summer') || lower.includes('ઉનાળુ')) return pick(SEASON_MAP.zaid, lang);
  if (SEASON_MAP[lower.trim()]) return pick(SEASON_MAP[lower.trim()], lang);
  return value;
};

export const translateCalendarMonths = (value, lang) => {
  if (!value || typeof value !== 'string') return value;
  const lower = value.toLowerCase();
  if (lower.includes('june') || lower.includes('જૂન')) return pick(CALENDAR_MONTH_RANGES.kharif, lang);
  if (lower.includes('october') || lower.includes('ઓક્ટોબર')) return pick(CALENDAR_MONTH_RANGES.rabi, lang);
  if (lower.includes('february') || lower.includes('ફેબ્રુઆરી')) return pick(CALENDAR_MONTH_RANGES.zaid, lang);
  return value;
};

const MONTH_REPLACEMENTS = [
  ['january', 0], ['jan', 0],
  ['february', 1], ['feb', 1],
  ['march', 2], ['mar', 2],
  ['april', 3], ['apr', 3],
  ['may', 4],
  ['june', 5], ['jun', 5],
  ['july', 6], ['jul', 6],
  ['august', 7], ['aug', 7],
  ['september', 8], ['sept', 8], ['sep', 8],
  ['october', 9], ['oct', 9],
  ['november', 10], ['nov', 10],
  ['december', 11], ['dec', 11],
];

/**
 * Translates English month names & duration words in crop timelines
 * e.g. "June - July" -> "જૂન - જુલાઈ", "7-10 days" -> "7-10 દિવસ"
 */
export const translateTimelineText = (value, lang) => {
  if (!value || typeof value !== 'string') return value;
  const l = normalizeLang(lang);
  if (l === 'en') return value;

  let res = value;
  for (const [eng, idx] of MONTH_REPLACEMENTS) {
    const re = new RegExp(`\\b${eng}\\b`, 'gi');
    res = res.replace(re, MONTHS[l][idx]);
  }

  const unitMap = {
    days: l === 'hi' ? 'दिन' : 'દિવસ',
    day: l === 'hi' ? 'दिन' : 'દિવસ',
    weeks: l === 'hi' ? 'सप्ताह' : 'અઠવાડિયા',
    week: l === 'hi' ? 'सप्ताह' : 'અઠવાડિયું',
    months: l === 'hi' ? 'महीने' : 'મહિના',
    month: l === 'hi' ? 'महीना' : 'મહિનો',
    to: l === 'hi' ? 'से' : 'થી',
    early: l === 'hi' ? 'शुरुआती' : 'શરૂઆત',
    mid: l === 'hi' ? 'मध्य' : 'મધ્ય',
    late: l === 'hi' ? 'देर से' : 'મોડું',
  };

  for (const [k, v] of Object.entries(unitMap)) {
    res = res.replace(new RegExp(`\\b${k}\\b`, 'gi'), v);
  }
  return res;
};

/**
 * Translates comma-separated soil list e.g. "Black Cotton Soil, Alluvial"
 */
export const translateSuitableSoil = (value, lang) => {
  if (!value || typeof value !== 'string') return value;
  const l = normalizeLang(lang);
  if (l === 'en') return value;

  return value
    .split(',')
    .map((part) => {
      const p = part.trim();
      const lower = p.toLowerCase();
      if (lower.includes('black cotton')) return l === 'hi' ? 'काली कपास मिट्टी' : 'કાળી કપાસની માટી';
      if (lower.includes('black')) return `${translateSoilType('black', l)} ${l === 'hi' ? 'मिट्टी' : 'માટી'}`;
      if (lower.includes('sandy loam')) return translateSoilType('sandy loam', l);
      if (lower.includes('clay loam')) return translateSoilTexture('clay loam', l);
      if (lower.includes('alluvial')) return `${translateSoilType('alluvial', l)} ${l === 'hi' ? 'मिट्टी' : 'માટી'}`;
      if (lower.includes('loam')) return translateSoilType('loamy', l);
      if (lower.includes('red')) return `${translateSoilType('red', l)} ${l === 'hi' ? 'मिट्टी' : 'માટી'}`;
      return translateSoilType(p, l);
    })
    .join(', ');
};

export const formatLocalizedDate = (dateInput, lang, { includeYear = true, includeWeekday = true } = {}) => {
  const l = normalizeLang(lang);
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(d.getTime())) return String(dateInput || '');
  const dayName = WEEKDAYS[l][d.getDay()];
  const dateNum = String(d.getDate()).padStart(2, '0');
  const monthName = MONTHS[l][d.getMonth()];
  const yearNum = d.getFullYear();

  const datePart = includeYear ? `${dateNum} ${monthName}, ${yearNum}` : `${dateNum} ${monthName}`;
  return includeWeekday ? `${dayName}, ${datePart}` : datePart;
};

export const getLanguageLabel = (code) => {
  const map = { gu: 'ગુજરાતી', hi: 'हिन्दी', en: 'English' };
  return map[code] || code;
};
