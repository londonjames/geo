// Region configurations for map projections and data sources

export const REGIONS = {
  europe: {
    id: 'europe',
    name: 'Europe',
    emoji: '🌍',
    dataUrl: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json',
    objectName: 'countries',
    projection: 'mercator',
    center: [15, 54],
    scale: 600,
    translate: [400, 350],
    viewBox: '0 0 800 700',
    filterFn: (feature) => EUROPE_COUNTRIES[String(feature.id)] !== undefined,
    getCode: (feature) => String(feature.id),
    getName: (code) => EUROPE_COUNTRIES[code],
    entities: 'countries',
  },

  'us-states': {
    id: 'us-states',
    name: 'US States',
    emoji: '🇺🇸',
    dataUrl: 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json',
    objectName: 'states',
    projection: 'albersUsa',
    scale: 1100,
    translate: [450, 260],
    viewBox: '0 0 900 520',
    filterFn: (feature) => US_STATES[String(feature.id).padStart(2, '0')] !== undefined,
    getCode: (feature) => String(feature.id).padStart(2, '0'),
    getName: (code) => US_STATES[code],
    entities: 'states',
  },

  africa: {
    id: 'africa',
    name: 'Africa',
    emoji: '🌍',
    dataUrl: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json',
    objectName: 'countries',
    projection: 'mercator',
    center: [20, 0],
    scale: 400,
    translate: [400, 350],
    viewBox: '0 0 800 700',
    filterFn: (feature) => AFRICA_COUNTRIES[String(feature.id)] !== undefined,
    getCode: (feature) => String(feature.id),
    getName: (code) => AFRICA_COUNTRIES[code],
    entities: 'countries',
  },

  asia: {
    id: 'asia',
    name: 'Asia',
    emoji: '🌏',
    dataUrl: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json',
    objectName: 'countries',
    projection: 'mercator',
    center: [100, 35],
    scale: 350,
    translate: [400, 400],
    viewBox: '0 0 800 700',
    filterFn: (feature) => ASIA_COUNTRIES[String(feature.id)] !== undefined,
    getCode: (feature) => String(feature.id),
    getName: (code) => ASIA_COUNTRIES[code],
    entities: 'countries',
  },

  'north-america': {
    id: 'north-america',
    name: 'North America',
    emoji: '🌎',
    dataUrl: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json',
    objectName: 'countries',
    projection: 'mercator',
    center: [-100, 45],
    scale: 300,
    translate: [400, 400],
    viewBox: '0 0 800 700',
    filterFn: (feature) => NORTH_AMERICA_COUNTRIES[String(feature.id)] !== undefined,
    getCode: (feature) => String(feature.id),
    getName: (code) => NORTH_AMERICA_COUNTRIES[code],
    entities: 'countries',
  },

  'south-america': {
    id: 'south-america',
    name: 'South America',
    emoji: '🌎',
    dataUrl: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json',
    objectName: 'countries',
    projection: 'mercator',
    center: [-60, -15],
    scale: 400,
    translate: [400, 350],
    viewBox: '0 0 800 700',
    filterFn: (feature) => SOUTH_AMERICA_COUNTRIES[String(feature.id)] !== undefined,
    getCode: (feature) => String(feature.id),
    getName: (code) => SOUTH_AMERICA_COUNTRIES[code],
    entities: 'countries',
  },

  oceania: {
    id: 'oceania',
    name: 'Oceania',
    emoji: '🌏',
    dataUrl: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json',
    objectName: 'countries',
    projection: 'mercator',
    center: [140, -25],
    scale: 400,
    translate: [400, 350],
    viewBox: '0 0 800 700',
    filterFn: (feature) => OCEANIA_COUNTRIES[String(feature.id)] !== undefined,
    getCode: (feature) => String(feature.id),
    getName: (code) => OCEANIA_COUNTRIES[code],
    entities: 'countries',
  },
};

// European countries with ISO 3166-1 numeric codes
export const EUROPE_COUNTRIES = {
  '008': 'Albania',
  '020': 'Andorra',
  '040': 'Austria',
  '112': 'Belarus',
  '056': 'Belgium',
  '070': 'Bosnia and Herzegovina',
  '100': 'Bulgaria',
  '191': 'Croatia',
  '196': 'Cyprus',
  '203': 'Czech Republic',
  '208': 'Denmark',
  '233': 'Estonia',
  '246': 'Finland',
  '250': 'France',
  '276': 'Germany',
  '300': 'Greece',
  '348': 'Hungary',
  '352': 'Iceland',
  '372': 'Ireland',
  '380': 'Italy',
  '428': 'Latvia',
  '438': 'Liechtenstein',
  '440': 'Lithuania',
  '442': 'Luxembourg',
  '807': 'North Macedonia',
  '470': 'Malta',
  '498': 'Moldova',
  '492': 'Monaco',
  '499': 'Montenegro',
  '528': 'Netherlands',
  '578': 'Norway',
  '616': 'Poland',
  '620': 'Portugal',
  '642': 'Romania',
  '643': 'Russia',
  '674': 'San Marino',
  '688': 'Serbia',
  '703': 'Slovakia',
  '705': 'Slovenia',
  '724': 'Spain',
  '752': 'Sweden',
  '756': 'Switzerland',
  '804': 'Ukraine',
  '826': 'United Kingdom',
  '336': 'Vatican City',
  '-99': 'Kosovo',
};

// US States with FIPS codes
export const US_STATES = {
  '01': 'Alabama', '02': 'Alaska', '04': 'Arizona', '05': 'Arkansas', '06': 'California',
  '08': 'Colorado', '09': 'Connecticut', '10': 'Delaware', '12': 'Florida', '13': 'Georgia',
  '15': 'Hawaii', '16': 'Idaho', '17': 'Illinois', '18': 'Indiana', '19': 'Iowa',
  '20': 'Kansas', '21': 'Kentucky', '22': 'Louisiana', '23': 'Maine', '24': 'Maryland',
  '25': 'Massachusetts', '26': 'Michigan', '27': 'Minnesota', '28': 'Mississippi',
  '29': 'Missouri', '30': 'Montana', '31': 'Nebraska', '32': 'Nevada', '33': 'New Hampshire',
  '34': 'New Jersey', '35': 'New Mexico', '36': 'New York', '37': 'North Carolina',
  '38': 'North Dakota', '39': 'Ohio', '40': 'Oklahoma', '41': 'Oregon', '42': 'Pennsylvania',
  '44': 'Rhode Island', '45': 'South Carolina', '46': 'South Dakota', '47': 'Tennessee',
  '48': 'Texas', '49': 'Utah', '50': 'Vermont', '51': 'Virginia', '53': 'Washington',
  '54': 'West Virginia', '55': 'Wisconsin', '56': 'Wyoming',
};

// African countries
export const AFRICA_COUNTRIES = {
  '012': 'Algeria', '024': 'Angola', '204': 'Benin', '072': 'Botswana', '854': 'Burkina Faso',
  '108': 'Burundi', '132': 'Cabo Verde', '120': 'Cameroon', '140': 'Central African Republic',
  '148': 'Chad', '174': 'Comoros', '178': 'Congo', '180': 'DR Congo', '384': "Côte d'Ivoire",
  '262': 'Djibouti', '818': 'Egypt', '226': 'Equatorial Guinea', '232': 'Eritrea',
  '748': 'Eswatini', '231': 'Ethiopia', '266': 'Gabon', '270': 'Gambia', '288': 'Ghana',
  '324': 'Guinea', '624': 'Guinea-Bissau', '404': 'Kenya', '426': 'Lesotho', '430': 'Liberia',
  '434': 'Libya', '450': 'Madagascar', '454': 'Malawi', '466': 'Mali', '478': 'Mauritania',
  '480': 'Mauritius', '504': 'Morocco', '508': 'Mozambique', '516': 'Namibia', '562': 'Niger',
  '566': 'Nigeria', '646': 'Rwanda', '678': 'São Tomé and Príncipe', '686': 'Senegal',
  '690': 'Seychelles', '694': 'Sierra Leone', '706': 'Somalia', '710': 'South Africa',
  '728': 'South Sudan', '729': 'Sudan', '834': 'Tanzania', '768': 'Togo', '788': 'Tunisia',
  '800': 'Uganda', '894': 'Zambia', '716': 'Zimbabwe',
};

// Asian countries
export const ASIA_COUNTRIES = {
  '004': 'Afghanistan', '051': 'Armenia', '031': 'Azerbaijan', '048': 'Bahrain',
  '050': 'Bangladesh', '064': 'Bhutan', '096': 'Brunei', '104': 'Myanmar', '116': 'Cambodia',
  '156': 'China', '196': 'Cyprus', '268': 'Georgia', '356': 'India', '360': 'Indonesia',
  '364': 'Iran', '368': 'Iraq', '376': 'Israel', '392': 'Japan', '400': 'Jordan',
  '398': 'Kazakhstan', '414': 'Kuwait', '417': 'Kyrgyzstan', '418': 'Laos', '422': 'Lebanon',
  '458': 'Malaysia', '462': 'Maldives', '496': 'Mongolia', '524': 'Nepal', '408': 'North Korea',
  '512': 'Oman', '586': 'Pakistan', '275': 'Palestine', '608': 'Philippines', '634': 'Qatar',
  '682': 'Saudi Arabia', '702': 'Singapore', '410': 'South Korea', '144': 'Sri Lanka',
  '760': 'Syria', '762': 'Tajikistan', '764': 'Thailand', '626': 'Timor-Leste', '792': 'Turkey',
  '795': 'Turkmenistan', '784': 'United Arab Emirates', '860': 'Uzbekistan', '704': 'Vietnam',
  '887': 'Yemen',
};

// North American countries (including Central America and Caribbean)
export const NORTH_AMERICA_COUNTRIES = {
  '028': 'Antigua and Barbuda', '044': 'Bahamas', '052': 'Barbados', '084': 'Belize',
  '124': 'Canada', '188': 'Costa Rica', '192': 'Cuba', '212': 'Dominica',
  '214': 'Dominican Republic', '222': 'El Salvador', '308': 'Grenada', '320': 'Guatemala',
  '332': 'Haiti', '340': 'Honduras', '388': 'Jamaica', '484': 'Mexico', '558': 'Nicaragua',
  '591': 'Panama', '659': 'Saint Kitts and Nevis', '662': 'Saint Lucia',
  '670': 'Saint Vincent and the Grenadines', '780': 'Trinidad and Tobago', '840': 'United States',
};

// South American countries
export const SOUTH_AMERICA_COUNTRIES = {
  '032': 'Argentina', '068': 'Bolivia', '076': 'Brazil', '152': 'Chile', '170': 'Colombia',
  '218': 'Ecuador', '328': 'Guyana', '600': 'Paraguay', '604': 'Peru', '740': 'Suriname',
  '858': 'Uruguay', '862': 'Venezuela',
};

// Oceania countries
export const OCEANIA_COUNTRIES = {
  '036': 'Australia', '242': 'Fiji', '296': 'Kiribati', '584': 'Marshall Islands',
  '583': 'Micronesia', '520': 'Nauru', '554': 'New Zealand', '585': 'Palau',
  '598': 'Papua New Guinea', '882': 'Samoa', '090': 'Solomon Islands', '776': 'Tonga',
  '798': 'Tuvalu', '548': 'Vanuatu',
};

// Regional hints for quizzes
export const EUROPE_REGIONS = {
  western: ['056', '250', '276', '372', '442', '492', '528', '826', '040', '756', '438', '020'],
  northern: ['208', '233', '246', '352', '428', '440', '578', '752'],
  southern: ['008', '070', '191', '196', '300', '380', '470', '499', '620', '674', '705', '724', '336', '807', '-99'],
  eastern: ['112', '100', '203', '348', '498', '616', '642', '643', '688', '703', '804'],
};

export const US_REGIONS = {
  west: ['02', '06', '08', '15', '16', '30', '32', '35', '41', '49', '53', '56', '04'],
  midwest: ['17', '18', '19', '20', '26', '27', '29', '31', '38', '39', '46', '55'],
  south: ['01', '05', '10', '12', '13', '21', '22', '24', '28', '37', '40', '45', '47', '48', '51', '54'],
  northeast: ['09', '23', '25', '33', '34', '36', '42', '44', '50'],
};

// Micro-states (optional in quiz)
export const EUROPE_MICROSTATES = ['020', '438', '470', '492', '674', '336'];

// Helpful hints for US states
const US_STATE_HINTS = {
  '01': 'Deep South, borders Florida and Georgia',
  '02': 'Huge state in the far northwest, not connected to lower 48',
  '04': 'Southwest corner, borders Mexico and California',
  '05': 'South-central, borders Mississippi River on east',
  '06': 'Long state on the Pacific coast',
  '08': 'Rocky Mountain state, rectangular shape',
  '09': 'Tiny state in New England, south of Massachusetts',
  '10': 'Second smallest state, on the Atlantic between Maryland and New Jersey',
  '12': 'Peninsula in the Southeast, surrounded by water on 3 sides',
  '13': 'Southeast, borders Florida to the south',
  '15': 'Island chain in the Pacific Ocean',
  '16': 'Northwest, shaped like a logger\'s boot',
  '17': 'Midwest, Chicago is here',
  '18': 'Midwest, directly east of Illinois',
  '19': 'Midwest, between Illinois and Nebraska',
  '20': 'Great Plains, rectangular, south of Nebraska',
  '21': 'South-central, famous for bourbon and horse racing',
  '22': 'Gulf Coast, boot-shaped, New Orleans is here',
  '23': 'Northeastern tip of the US, lots of coastline',
  '24': 'Mid-Atlantic, small state north of Washington DC',
  '25': 'New England, Boston is here',
  '26': 'Great Lakes state shaped like a mitten',
  '27': 'Upper Midwest, borders Canada, Land of 10,000 Lakes',
  '28': 'Deep South, borders Louisiana and Alabama',
  '29': 'Midwest, borders 8 states, St. Louis and Kansas City',
  '30': 'Big Sky country, northern border with Canada',
  '31': 'Great Plains, directly south of South Dakota',
  '32': 'Desert state, Las Vegas is here',
  '33': 'Small New England state, south of Maine',
  '34': 'Mid-Atlantic, directly across from New York City',
  '35': 'Southwest, between Arizona and Texas',
  '36': 'Mid-Atlantic, Empire State, NYC is here',
  '37': 'Southeast Atlantic coast, south of Virginia',
  '38': 'Northern Plains, borders Canada, very rectangular',
  '39': 'Midwest, borders Lake Erie, Cleveland and Cincinnati',
  '40': 'Southern Plains, panhandle points west',
  '41': 'Pacific Northwest, borders California and Washington',
  '42': 'Mid-Atlantic, Philadelphia and Pittsburgh',
  '44': 'Smallest state, New England, south of Massachusetts',
  '45': 'Southeast, first state to secede, borders Georgia',
  '46': 'Northern Plains, Mount Rushmore is here',
  '47': 'South-central, Nashville and Memphis, long horizontal shape',
  '48': 'Huge southern state, borders Mexico',
  '49': 'Rocky Mountains, Salt Lake City, rectangular',
  '50': 'New England, tiny state between New Hampshire and New York',
  '51': 'Mid-Atlantic, Washington DC borders it',
  '53': 'Pacific Northwest, Seattle is here, borders Canada',
  '54': 'Appalachian state, unusual shape, "almost heaven"',
  '55': 'Upper Midwest, borders Lake Michigan and Lake Superior',
  '56': 'Rocky Mountain state, rectangular, Yellowstone is here',
};

export function getRegionHint(regionId, code) {
  if (regionId === 'europe') {
    for (const [region, countries] of Object.entries(EUROPE_REGIONS)) {
      if (countries.includes(code)) {
        return region.charAt(0).toUpperCase() + region.slice(1) + ' Europe';
      }
    }
    return 'Europe';
  }
  if (regionId === 'us-states') {
    return US_STATE_HINTS[code] || 'USA';
  }
  return '';
}
