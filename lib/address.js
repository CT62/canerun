// Normalizes a customer-typed state/province (full name or abbreviation, any case) into the
// 2-letter code carriers actually expect — the shipping address form accepts free text, but
// ShipEngine/FedEx/UPS/USPS all require the code, not "Illinois".
const US_STATES = {
  alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA', colorado: 'CO',
  connecticut: 'CT', delaware: 'DE', florida: 'FL', georgia: 'GA', hawaii: 'HI', idaho: 'ID',
  illinois: 'IL', indiana: 'IN', iowa: 'IA', kansas: 'KS', kentucky: 'KY', louisiana: 'LA',
  maine: 'ME', maryland: 'MD', massachusetts: 'MA', michigan: 'MI', minnesota: 'MN',
  mississippi: 'MS', missouri: 'MO', montana: 'MT', nebraska: 'NE', nevada: 'NV',
  'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
  'north carolina': 'NC', 'north dakota': 'ND', ohio: 'OH', oklahoma: 'OK', oregon: 'OR',
  pennsylvania: 'PA', 'rhode island': 'RI', 'south carolina': 'SC', 'south dakota': 'SD',
  tennessee: 'TN', texas: 'TX', utah: 'UT', vermont: 'VT', virginia: 'VA', washington: 'WA',
  'west virginia': 'WV', wisconsin: 'WI', wyoming: 'WY',
  'district of columbia': 'DC', 'puerto rico': 'PR', 'american samoa': 'AS', guam: 'GU',
  'northern mariana islands': 'MP', 'u.s. virgin islands': 'VI', 'us virgin islands': 'VI',
};

const CA_PROVINCES = {
  alberta: 'AB', 'british columbia': 'BC', manitoba: 'MB', 'new brunswick': 'NB',
  'newfoundland and labrador': 'NL', 'nova scotia': 'NS', ontario: 'ON',
  'prince edward island': 'PE', quebec: 'QC', 'québec': 'QC', saskatchewan: 'SK',
  'northwest territories': 'NT', nunavut: 'NU', yukon: 'YT',
};

const KNOWN_CODES = new Set([...Object.values(US_STATES), ...Object.values(CA_PROVINCES)]);

export function normalizeStateProvince(value) {
  if (!value) return value;
  const trimmed = String(value).trim();
  const upper = trimmed.toUpperCase();
  if (trimmed.length === 2 && KNOWN_CODES.has(upper)) return upper;
  const key = trimmed.toLowerCase();
  return US_STATES[key] || CA_PROVINCES[key] || upper;
}

export function normalizeShipTo(shipTo) {
  if (!shipTo) return shipTo;
  return { ...shipTo, stateProvince: normalizeStateProvince(shipTo.stateProvince) };
}
