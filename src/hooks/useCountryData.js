import { useState, useEffect } from 'react';

// Map ISO numeric codes to alpha-2 codes for REST Countries API
const NUMERIC_TO_ALPHA2 = {
  // Europe
  '008': 'AL', '020': 'AD', '040': 'AT', '112': 'BY', '056': 'BE', '070': 'BA',
  '100': 'BG', '191': 'HR', '196': 'CY', '203': 'CZ', '208': 'DK', '233': 'EE',
  '246': 'FI', '250': 'FR', '276': 'DE', '300': 'GR', '348': 'HU', '352': 'IS',
  '372': 'IE', '380': 'IT', '428': 'LV', '438': 'LI', '440': 'LT', '442': 'LU',
  '807': 'MK', '470': 'MT', '498': 'MD', '492': 'MC', '499': 'ME', '528': 'NL',
  '578': 'NO', '616': 'PL', '620': 'PT', '642': 'RO', '643': 'RU', '674': 'SM',
  '688': 'RS', '703': 'SK', '705': 'SI', '724': 'ES', '752': 'SE', '756': 'CH',
  '804': 'UA', '826': 'GB', '336': 'VA', '-99': 'XK',
  // Africa
  '012': 'DZ', '024': 'AO', '204': 'BJ', '072': 'BW', '854': 'BF', '108': 'BI',
  '132': 'CV', '120': 'CM', '140': 'CF', '148': 'TD', '174': 'KM', '178': 'CG',
  '180': 'CD', '384': 'CI', '262': 'DJ', '818': 'EG', '226': 'GQ', '232': 'ER',
  '748': 'SZ', '231': 'ET', '266': 'GA', '270': 'GM', '288': 'GH', '324': 'GN',
  '624': 'GW', '404': 'KE', '426': 'LS', '430': 'LR', '434': 'LY', '450': 'MG',
  '454': 'MW', '466': 'ML', '478': 'MR', '480': 'MU', '504': 'MA', '508': 'MZ',
  '516': 'NA', '562': 'NE', '566': 'NG', '646': 'RW', '678': 'ST', '686': 'SN',
  '690': 'SC', '694': 'SL', '706': 'SO', '710': 'ZA', '728': 'SS', '729': 'SD',
  '834': 'TZ', '768': 'TG', '788': 'TN', '800': 'UG', '894': 'ZM', '716': 'ZW',
  // Asia
  '004': 'AF', '051': 'AM', '031': 'AZ', '048': 'BH', '050': 'BD', '064': 'BT',
  '096': 'BN', '104': 'MM', '116': 'KH', '156': 'CN', '268': 'GE', '356': 'IN',
  '360': 'ID', '364': 'IR', '368': 'IQ', '376': 'IL', '392': 'JP', '400': 'JO',
  '398': 'KZ', '414': 'KW', '417': 'KG', '418': 'LA', '422': 'LB', '458': 'MY',
  '462': 'MV', '496': 'MN', '524': 'NP', '408': 'KP', '512': 'OM', '586': 'PK',
  '275': 'PS', '608': 'PH', '634': 'QA', '682': 'SA', '702': 'SG', '410': 'KR',
  '144': 'LK', '760': 'SY', '762': 'TJ', '764': 'TH', '626': 'TL', '792': 'TR',
  '795': 'TM', '784': 'AE', '860': 'UZ', '704': 'VN', '887': 'YE',
  // North America
  '028': 'AG', '044': 'BS', '052': 'BB', '084': 'BZ', '124': 'CA', '188': 'CR',
  '192': 'CU', '212': 'DM', '214': 'DO', '222': 'SV', '308': 'GD', '320': 'GT',
  '332': 'HT', '340': 'HN', '388': 'JM', '484': 'MX', '558': 'NI', '591': 'PA',
  '659': 'KN', '662': 'LC', '670': 'VC', '780': 'TT', '840': 'US',
  // South America
  '032': 'AR', '068': 'BO', '076': 'BR', '152': 'CL', '170': 'CO', '218': 'EC',
  '328': 'GY', '600': 'PY', '604': 'PE', '740': 'SR', '858': 'UY', '862': 'VE',
  // Oceania
  '036': 'AU', '242': 'FJ', '296': 'KI', '584': 'MH', '583': 'FM', '520': 'NR',
  '554': 'NZ', '585': 'PW', '598': 'PG', '882': 'WS', '090': 'SB', '776': 'TO',
  '798': 'TV', '548': 'VU',
};

// World population rankings by alpha-2 code (top 200 countries)
const POPULATION_RANKS = {
  'IN': 1, 'CN': 2, 'US': 3, 'ID': 4, 'PK': 5, 'NG': 6, 'BR': 7, 'BD': 8, 'RU': 9, 'MX': 10,
  'ET': 11, 'JP': 12, 'PH': 13, 'EG': 14, 'VN': 15, 'CD': 16, 'TR': 17, 'IR': 18, 'DE': 19, 'TH': 20,
  'GB': 21, 'FR': 22, 'TZ': 23, 'ZA': 24, 'IT': 25, 'KE': 26, 'MM': 27, 'CO': 28, 'KR': 29, 'UG': 30,
  'ES': 31, 'AR': 32, 'DZ': 33, 'SD': 34, 'IQ': 35, 'AF': 36, 'PL': 37, 'CA': 38, 'MA': 39, 'SA': 40,
  'UA': 41, 'AO': 42, 'UZ': 43, 'PE': 44, 'MY': 45, 'MZ': 46, 'GH': 47, 'YE': 48, 'NP': 49, 'VE': 50,
  'MG': 51, 'CM': 52, 'CI': 53, 'AU': 54, 'KP': 55, 'NE': 56, 'TW': 57, 'LK': 58, 'BF': 59, 'ML': 60,
  'RO': 61, 'MW': 62, 'CL': 63, 'KZ': 64, 'ZM': 65, 'EC': 66, 'SY': 67, 'NL': 68, 'SN': 69, 'GT': 70,
  'TD': 71, 'SO': 72, 'ZW': 73, 'KH': 74, 'SS': 75, 'RW': 76, 'GN': 77, 'CU': 78, 'BJ': 79, 'BI': 80,
  'BE': 81, 'BO': 82, 'TN': 83, 'HT': 84, 'JO': 85, 'DO': 86, 'CZ': 87, 'GR': 88, 'PT': 89, 'AZ': 90,
  'SE': 91, 'HU': 92, 'AE': 93, 'BY': 94, 'HN': 95, 'TJ': 96, 'AT': 97, 'CH': 98, 'PG': 99, 'IL': 100,
  'TG': 101, 'SL': 102, 'LA': 103, 'PY': 104, 'BG': 105, 'LY': 106, 'LB': 107, 'NI': 108, 'SV': 109, 'KG': 110,
  'TM': 111, 'SG': 112, 'DK': 113, 'FI': 114, 'SK': 115, 'NO': 116, 'ER': 117, 'PS': 118, 'CR': 119, 'IE': 120,
  'CF': 121, 'NZ': 122, 'LR': 123, 'MR': 124, 'PA': 125, 'KW': 126, 'HR': 127, 'GE': 128, 'OM': 129, 'BA': 130,
  'PR': 131, 'UY': 132, 'MN': 133, 'AM': 134, 'JM': 135, 'QA': 136, 'AL': 137, 'LT': 138, 'NA': 139, 'GM': 140,
  'BW': 141, 'GA': 142, 'LS': 143, 'MK': 144, 'SI': 145, 'GW': 146, 'BH': 147, 'LV': 148, 'SZ': 149, 'TT': 150,
};

// US State data with nicknames
const US_STATE_DATA = {
  '01': { name: 'Alabama', capital: 'Montgomery', population: 5024279, area: 135767, region: 'South', nickname: 'The Yellowhammer State' },
  '02': { name: 'Alaska', capital: 'Juneau', population: 733391, area: 1723337, region: 'West', nickname: 'The Last Frontier' },
  '04': { name: 'Arizona', capital: 'Phoenix', population: 7151502, area: 295234, region: 'West', nickname: 'The Grand Canyon State' },
  '05': { name: 'Arkansas', capital: 'Little Rock', population: 3011524, area: 137732, region: 'South', nickname: 'The Natural State' },
  '06': { name: 'California', capital: 'Sacramento', population: 39538223, area: 423967, region: 'West', nickname: 'The Golden State' },
  '08': { name: 'Colorado', capital: 'Denver', population: 5773714, area: 269601, region: 'West', nickname: 'The Centennial State' },
  '09': { name: 'Connecticut', capital: 'Hartford', population: 3605944, area: 14357, region: 'Northeast', nickname: 'The Constitution State' },
  '10': { name: 'Delaware', capital: 'Dover', population: 989948, area: 6446, region: 'South', nickname: 'The First State' },
  '12': { name: 'Florida', capital: 'Tallahassee', population: 21538187, area: 170312, region: 'South', nickname: 'The Sunshine State' },
  '13': { name: 'Georgia', capital: 'Atlanta', population: 10711908, area: 153910, region: 'South', nickname: 'The Peach State' },
  '15': { name: 'Hawaii', capital: 'Honolulu', population: 1455271, area: 28313, region: 'West', nickname: 'The Aloha State' },
  '16': { name: 'Idaho', capital: 'Boise', population: 1839106, area: 216443, region: 'West', nickname: 'The Gem State' },
  '17': { name: 'Illinois', capital: 'Springfield', population: 12812508, area: 149995, region: 'Midwest', nickname: 'The Prairie State' },
  '18': { name: 'Indiana', capital: 'Indianapolis', population: 6785528, area: 94326, region: 'Midwest', nickname: 'The Hoosier State' },
  '19': { name: 'Iowa', capital: 'Des Moines', population: 3190369, area: 145746, region: 'Midwest', nickname: 'The Hawkeye State' },
  '20': { name: 'Kansas', capital: 'Topeka', population: 2937880, area: 213100, region: 'Midwest', nickname: 'The Sunflower State' },
  '21': { name: 'Kentucky', capital: 'Frankfort', population: 4505836, area: 104656, region: 'South', nickname: 'The Bluegrass State' },
  '22': { name: 'Louisiana', capital: 'Baton Rouge', population: 4657757, area: 135659, region: 'South', nickname: 'The Pelican State' },
  '23': { name: 'Maine', capital: 'Augusta', population: 1362359, area: 91633, region: 'Northeast', nickname: 'The Pine Tree State' },
  '24': { name: 'Maryland', capital: 'Annapolis', population: 6177224, area: 32131, region: 'South', nickname: 'The Old Line State' },
  '25': { name: 'Massachusetts', capital: 'Boston', population: 7029917, area: 27336, region: 'Northeast', nickname: 'The Bay State' },
  '26': { name: 'Michigan', capital: 'Lansing', population: 10077331, area: 250487, region: 'Midwest', nickname: 'The Great Lakes State' },
  '27': { name: 'Minnesota', capital: 'Saint Paul', population: 5706494, area: 225163, region: 'Midwest', nickname: 'The Land of 10,000 Lakes' },
  '28': { name: 'Mississippi', capital: 'Jackson', population: 2961279, area: 125438, region: 'South', nickname: 'The Magnolia State' },
  '29': { name: 'Missouri', capital: 'Jefferson City', population: 6154913, area: 180540, region: 'Midwest', nickname: 'The Show-Me State' },
  '30': { name: 'Montana', capital: 'Helena', population: 1084225, area: 380831, region: 'West', nickname: 'The Treasure State' },
  '31': { name: 'Nebraska', capital: 'Lincoln', population: 1961504, area: 200330, region: 'Midwest', nickname: 'The Cornhusker State' },
  '32': { name: 'Nevada', capital: 'Carson City', population: 3104614, area: 286380, region: 'West', nickname: 'The Silver State' },
  '33': { name: 'New Hampshire', capital: 'Concord', population: 1377529, area: 24214, region: 'Northeast', nickname: 'The Granite State' },
  '34': { name: 'New Jersey', capital: 'Trenton', population: 9288994, area: 22591, region: 'Northeast', nickname: 'The Garden State' },
  '35': { name: 'New Mexico', capital: 'Santa Fe', population: 2117522, area: 314917, region: 'West', nickname: 'The Land of Enchantment' },
  '36': { name: 'New York', capital: 'Albany', population: 20201249, area: 141297, region: 'Northeast', nickname: 'The Empire State' },
  '37': { name: 'North Carolina', capital: 'Raleigh', population: 10439388, area: 139391, region: 'South', nickname: 'The Tar Heel State' },
  '38': { name: 'North Dakota', capital: 'Bismarck', population: 779094, area: 183108, region: 'Midwest', nickname: 'The Peace Garden State' },
  '39': { name: 'Ohio', capital: 'Columbus', population: 11799448, area: 116098, region: 'Midwest', nickname: 'The Buckeye State' },
  '40': { name: 'Oklahoma', capital: 'Oklahoma City', population: 3959353, area: 181037, region: 'South', nickname: 'The Sooner State' },
  '41': { name: 'Oregon', capital: 'Salem', population: 4237256, area: 254799, region: 'West', nickname: 'The Beaver State' },
  '42': { name: 'Pennsylvania', capital: 'Harrisburg', population: 13002700, area: 119280, region: 'Northeast', nickname: 'The Keystone State' },
  '44': { name: 'Rhode Island', capital: 'Providence', population: 1097379, area: 4001, region: 'Northeast', nickname: 'The Ocean State' },
  '45': { name: 'South Carolina', capital: 'Columbia', population: 5118425, area: 82933, region: 'South', nickname: 'The Palmetto State' },
  '46': { name: 'South Dakota', capital: 'Pierre', population: 886667, area: 199729, region: 'Midwest', nickname: 'The Mount Rushmore State' },
  '47': { name: 'Tennessee', capital: 'Nashville', population: 6910840, area: 109153, region: 'South', nickname: 'The Volunteer State' },
  '48': { name: 'Texas', capital: 'Austin', population: 29145505, area: 695662, region: 'South', nickname: 'The Lone Star State' },
  '49': { name: 'Utah', capital: 'Salt Lake City', population: 3271616, area: 219882, region: 'West', nickname: 'The Beehive State' },
  '50': { name: 'Vermont', capital: 'Montpelier', population: 643077, area: 24906, region: 'Northeast', nickname: 'The Green Mountain State' },
  '51': { name: 'Virginia', capital: 'Richmond', population: 8631393, area: 110787, region: 'South', nickname: 'The Old Dominion State' },
  '53': { name: 'Washington', capital: 'Olympia', population: 7614893, area: 184661, region: 'West', nickname: 'The Evergreen State' },
  '54': { name: 'West Virginia', capital: 'Charleston', population: 1793716, area: 62756, region: 'South', nickname: 'The Mountain State' },
  '55': { name: 'Wisconsin', capital: 'Madison', population: 5893718, area: 169635, region: 'Midwest', nickname: 'America\'s Dairyland' },
  '56': { name: 'Wyoming', capital: 'Cheyenne', population: 576851, area: 253335, region: 'West', nickname: 'The Cowboy State' },
};

// Calculate rankings once
const stateArray = Object.entries(US_STATE_DATA).map(([code, data]) => ({ code, ...data }));
const byPopulation = [...stateArray].sort((a, b) => b.population - a.population);
const byArea = [...stateArray].sort((a, b) => b.area - a.area);

const STATE_RANKINGS = {};
stateArray.forEach(state => {
  STATE_RANKINGS[state.code] = {
    populationRank: byPopulation.findIndex(s => s.code === state.code) + 1,
    areaRank: byArea.findIndex(s => s.code === state.code) + 1,
  };
});

// Cache for API responses
const countryCache = {};

export function useCountryData(numericCode, regionId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!numericCode) {
      setData(null);
      setLoading(false);
      return;
    }

    // Handle US States differently
    if (regionId === 'us-states') {
      const stateData = US_STATE_DATA[numericCode];
      const rankings = STATE_RANKINGS[numericCode];
      if (stateData && rankings) {
        setData({
          type: 'state',
          ...stateData,
          code: numericCode,
          populationRank: rankings.populationRank,
          areaRank: rankings.areaRank,
        });
      }
      setLoading(false);
      return;
    }

    // Check cache
    if (countryCache[numericCode]) {
      setData(countryCache[numericCode]);
      setLoading(false);
      return;
    }

    const alpha2 = NUMERIC_TO_ALPHA2[numericCode];
    if (!alpha2) {
      setError('Country code not found');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${alpha2}`);
        if (!response.ok) throw new Error('Failed to fetch country data');

        const [country] = await response.json();

        // Get population rank
        const populationRank = POPULATION_RANKS[alpha2] || null;

        const countryData = {
          type: 'country',
          code: alpha2,
          name: country.name.common,
          officialName: country.name.official,
          capital: country.capital?.[0] || 'N/A',
          population: country.population,
          populationRank,
          area: country.area,
          region: country.region,
          subregion: country.subregion,
          languages: country.languages ? Object.values(country.languages) : [],
          currencies: country.currencies
            ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol || ''})`)
            : [],
          flag: country.flags?.svg || country.flags?.png,
          flagEmoji: country.flag,
          borders: country.borders || [],
          timezones: country.timezones || [],
          continent: country.continents?.[0],
          landlocked: country.landlocked,
          unMember: country.unMember,
          independent: country.independent,
          coatOfArms: country.coatOfArms?.svg,
          maps: country.maps,
          gini: country.gini ? Object.values(country.gini)[0] : null,
          car: country.car?.side,
        };

        countryCache[numericCode] = countryData;
        setData(countryData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [numericCode, regionId]);

  return { data, loading, error };
}

export function formatPopulation(num) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(0) + 'K';
  return num.toString();
}

export function formatArea(km2) {
  return km2.toLocaleString() + ' km²';
}
