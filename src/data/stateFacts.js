// Fun facts for US states - kid-friendly and memorable!
const STATE_FACTS = {
  '01': { // Alabama
    records: ['First state to declare Christmas a legal holiday'],
    athletes: ['Hank Aaron (baseball legend)', 'Bo Jackson (football/baseball)'],
    wildFact: ['Home to the only monument honoring a pest - the boll weevil!'],
  },
  '02': { // Alaska
    records: ['Largest state - bigger than Texas, California, and Montana combined!', 'Has more coastline than all other US states combined'],
    animals: ['Grizzly bears, moose, and polar bears roam free'],
    wildFact: ['The sun doesn\'t set for 84 days in summer in some parts'],
  },
  '04': { // Arizona
    records: ['Grand Canyon is one of the 7 natural wonders of the world'],
    wildFact: ['It\'s illegal to let a donkey sleep in a bathtub here'],
    animals: ['Home to 13 species of rattlesnakes!'],
  },
  '05': { // Arkansas
    records: ['Only US state that produces diamonds', 'World\'s largest spinach can is here (Popeye statue)'],
    wildFact: ['Crater of Diamonds park lets you keep any diamonds you find!'],
  },
  '06': { // California
    records: ['Highest and lowest points in continental US are both here', 'World\'s 5th largest economy if it were a country'],
    gaming: ['Disneyland, Apple, Google, and Hollywood are all here'],
    athletes: ['Tiger Woods, Serena Williams, Tom Brady (born here)'],
  },
  '08': { // Colorado
    records: ['Has the highest paved road in North America', 'More microbreweries per capita than any state'],
    wildFact: ['The Cheeseburger was invented in Denver!'],
  },
  '09': { // Connecticut
    records: ['First state to have a speed limit law (12 mph in 1901)', 'First phone book was published here'],
    history: ['Home to Yale University, founded in 1701'],
  },
  '10': { // Delaware
    records: ['First state to ratify the Constitution', 'Second smallest state'],
    wildFact: ['More companies incorporated here than actual residents!'],
  },
  '12': { // Florida
    records: ['Most golf courses of any state', 'Lightning capital of the US'],
    animals: ['Only place where alligators AND crocodiles live together', 'Manatees, panthers, and flamingos live here'],
    gaming: ['Disney World, Universal Studios, and NASA Kennedy Space Center'],
  },
  '13': { // Georgia
    records: ['Produces the most peanuts and pecans in the US'],
    gaming: ['Coca-Cola was invented in Atlanta'],
    athletes: ['Herschel Walker, Ty Cobb (baseball legend)'],
  },
  '15': { // Hawaii
    records: ['Only state made entirely of islands', 'Only state that grows coffee commercially'],
    wildFact: ['No snakes here - they\'re illegal!', 'Has its own time zone'],
    animals: ['Spinner dolphins, sea turtles, and humpback whales'],
  },
  '16': { // Idaho
    records: ['Produces 1/3 of all potatoes in the US'],
    wildFact: ['Has the deepest gorge in North America (deeper than Grand Canyon!)'],
  },
  '17': { // Illinois
    records: ['Chicago has the first skyscraper ever built', 'First McDonald\'s opened here'],
    athletes: ['Michael Jordan played for the Chicago Bulls'],
    gaming: ['Deep dish pizza was invented in Chicago'],
  },
  '18': { // Indiana
    records: ['Indianapolis 500 is the world\'s largest single-day sporting event'],
    athletes: ['Larry Bird, Peyton Manning were born here'],
    wildFact: ['Santa Claus, Indiana gets thousands of letters to Santa every year'],
  },
  '19': { // Iowa
    records: ['Produces more corn and pigs than any other state'],
    wildFact: ['The shortest and steepest railroad in the US is here'],
  },
  '20': { // Kansas
    records: ['Geographic center of the continental US', 'Flatter than a pancake (scientifically proven!)'],
    wildFact: ['Dodge City is the windiest city in the US'],
  },
  '21': { // Kentucky
    records: ['Has the longest cave system in the world - Mammoth Cave'],
    traditions: ['Kentucky Derby is the oldest continuously held horse race in the US'],
    gaming: ['KFC (Kentucky Fried Chicken) started here'],
  },
  '22': { // Louisiana
    food: ['Invented jazz music!', 'Cajun and Creole food like gumbo, jambalaya'],
    traditions: ['Mardi Gras in New Orleans is one of biggest parties in the world'],
    animals: ['Alligators everywhere - even in people\'s backyards!'],
  },
  '23': { // Maine
    records: ['Easternmost state in the US', '90% covered in forest - most of any state'],
    food: ['Famous for lobster - catches more than any other state'],
  },
  '24': { // Maryland
    records: ['State sport is jousting (like medieval knights!)'],
    food: ['Famous for blue crabs and Old Bay seasoning'],
    history: ['Star-Spangled Banner was written here during a battle'],
  },
  '25': { // Massachusetts
    records: ['Has the first public beach (1896) and first subway (1897) in America'],
    history: ['Where the American Revolution started'],
    gaming: ['Basketball was invented here'],
  },
  '26': { // Michigan
    records: ['Surrounded by the Great Lakes - more than any other state', 'Has 11,000 inland lakes'],
    wildFact: ['No point in Michigan is more than 6 miles from a lake'],
    gaming: ['Cereal capital of the world (Kellogg\'s is from here)'],
  },
  '27': { // Minnesota
    records: ['Land of 10,000 Lakes (actually has 11,842!)', 'Mall of America is the largest mall in the US'],
    wildFact: ['Spam (the meat) was invented here'],
  },
  '28': { // Mississippi
    records: ['Named after the Mississippi River - 2nd longest in the US'],
    history: ['Birthplace of the blues and rock & roll'],
    food: ['Root beer was invented here'],
  },
  '29': { // Missouri
    records: ['St. Louis Gateway Arch is tallest man-made monument in US'],
    history: ['Starting point of the Oregon and Santa Fe trails'],
    food: ['Ice cream cones were invented at the 1904 World\'s Fair here'],
  },
  '30': { // Montana
    records: ['Has more cattle than people', 'Glacier National Park has 25 glaciers'],
    animals: ['Grizzly bears, wolves, and mountain lions roam free'],
  },
  '31': { // Nebraska
    records: ['Has the largest indoor rainforest in the US'],
    wildFact: ['Kool-Aid was invented here'],
  },
  '32': { // Nevada
    records: ['Las Vegas has more hotel rooms than any other city on Earth', 'Driest state in the US'],
    wildFact: ['Area 51 is here (maybe aliens too?)'],
  },
  '33': { // New Hampshire
    records: ['Has the shortest ocean coastline - only 13 miles'],
    traditions: ['First in the nation to vote in presidential primaries'],
    wildFact: ['No sales tax or income tax!'],
  },
  '34': { // New Jersey
    records: ['Most diners in the world', 'Most densely populated state'],
    gaming: ['First baseball game was played here in 1846'],
    food: ['Saltwater taffy was invented here'],
  },
  '35': { // New Mexico
    records: ['Oldest capital city in the US (Santa Fe, founded 1610)'],
    wildFact: ['Only state with an official state question: "Red or green?" (chile)'],
    history: ['First atomic bomb was tested here'],
  },
  '36': { // New York
    records: ['Statue of Liberty was a gift from France', 'Times Square is "Crossroads of the World"'],
    gaming: ['Pizza, bagels, and cheesecake are NYC staples'],
    athletes: ['Home to Yankees, Knicks, Giants, and more'],
  },
  '37': { // North Carolina
    records: ['First in flight - Wright Brothers flew here', 'Largest home in America (Biltmore Estate)'],
    athletes: ['Michael Jordan went to college here'],
  },
  '38': { // North Dakota
    records: ['Most churches per capita in the US'],
    wildFact: ['Gets more tornadoes per square mile than any other state'],
  },
  '39': { // Ohio
    records: ['Most astronauts born here - 25 and counting!', 'First professional baseball team (1869)'],
    gaming: ['Rock and Roll Hall of Fame is in Cleveland'],
  },
  '40': { // Oklahoma
    records: ['Has more man-made lakes than any other state'],
    wildFact: ['The parking meter was invented here'],
    history: ['Shopping cart was invented in Oklahoma City'],
  },
  '41': { // Oregon
    records: ['Crater Lake is the deepest lake in the US'],
    wildFact: ['Has a city named Boring (and it\'s sister cities with Dull, Scotland!)'],
    food: ['No self-service gas stations allowed - someone pumps it for you'],
  },
  '42': { // Pennsylvania
    records: ['First zoo in America (Philadelphia Zoo, 1874)'],
    history: ['Declaration of Independence and Constitution were signed here'],
    food: ['Philly cheesesteaks and soft pretzels are famous'],
  },
  '44': { // Rhode Island
    records: ['Smallest state but longest official name', 'First state to declare independence from Britain'],
    wildFact: ['State is so small you can drive across it in 45 minutes'],
  },
  '45': { // South Carolina
    records: ['First state to secede from the Union', 'First shots of Civil War fired here'],
    food: ['BBQ mustard sauce is a thing here'],
  },
  '46': { // South Dakota
    records: ['Mount Rushmore has 4 presidents carved into a mountain', 'Largest sculpture in the world being carved (Crazy Horse)'],
  },
  '47': { // Tennessee
    records: ['Nashville is "Music City" - home of country music', 'Memphis is birthplace of rock n roll and blues'],
    gaming: ['Graceland (Elvis\'s home) gets 600,000 visitors per year'],
  },
  '48': { // Texas
    records: ['Largest state in continental US', 'Only state that was its own country (Republic of Texas)'],
    food: ['Invented frozen margarita machine and Fritos'],
    athletes: ['Cowboys, Spurs, and Rangers are legendary teams'],
  },
  '49': { // Utah
    records: ['Has the most Jell-O consumption per capita'],
    wildFact: ['Great Salt Lake is saltier than the ocean'],
    gaming: ['5 national parks - most of any state tied with California'],
  },
  '50': { // Vermont
    records: ['First state to ban slavery', 'Produces most maple syrup in the US'],
    wildFact: ['Billboards are banned here - the only state to do so'],
  },
  '51': { // Virginia
    records: ['8 presidents were born here - most of any state', 'First permanent English settlement in America (Jamestown)'],
    history: ['Civil War ended here at Appomattox'],
  },
  '53': { // Washington
    records: ['Produces the most apples in the US'],
    gaming: ['Microsoft, Amazon, Starbucks, and Nintendo of America are headquartered here'],
    wildFact: ['Has a rainforest - Olympic National Park'],
  },
  '54': { // West Virginia
    records: ['First state to have a sales tax'],
    wildFact: ['New River is actually one of the oldest rivers in the world!'],
    history: ['Only state formed by seceding from a Confederate state'],
  },
  '55': { // Wisconsin
    records: ['Produces the most cheese in the US - "America\'s Dairyland"'],
    traditions: ['Fans wear cheese-shaped hats at Packers games'],
    wildFact: ['Invented the ice cream sundae'],
  },
  '56': { // Wyoming
    records: ['Least populated state', 'Yellowstone was the world\'s first national park'],
    wildFact: ['Has more hot springs than any other place on Earth'],
    animals: ['Grizzlies, wolves, bison, and elk roam Yellowstone'],
  },
};

export function getStateFacts(stateCode) {
  return STATE_FACTS[stateCode] || null;
}
