// Curated images for countries (using Unsplash)
// Format: [image1, image2] with {url, caption}

const COUNTRY_IMAGES = {
  // Europe
  'FR': [
    { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', caption: 'Eiffel Tower, Paris' },
    { url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400', caption: 'Streets of Paris' },
  ],
  'DE': [
    { url: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400', caption: 'Brandenburg Gate' },
    { url: 'https://images.unsplash.com/photo-1554072675-66db59dba46f?w=400', caption: 'Neuschwanstein Castle' },
  ],
  'IT': [
    { url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', caption: 'Colosseum, Rome' },
    { url: 'https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=400', caption: 'Venice Canals' },
  ],
  'ES': [
    { url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', caption: 'Sagrada Familia, Barcelona' },
    { url: 'https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=400', caption: 'Plaza Mayor, Madrid' },
  ],
  'GB': [
    { url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', caption: 'Tower Bridge, London' },
    { url: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=400', caption: 'Big Ben' },
  ],
  'NL': [
    { url: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400', caption: 'Amsterdam Canals' },
    { url: 'https://images.unsplash.com/photo-1588291451193-fc5c51be11cd?w=400', caption: 'Tulip Fields' },
  ],
  'GR': [
    { url: 'https://images.unsplash.com/photo-1503152394-c571994fd383?w=400', caption: 'Santorini' },
    { url: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=400', caption: 'Acropolis, Athens' },
  ],
  'PT': [
    { url: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400', caption: 'Lisbon Tram' },
    { url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400', caption: 'Porto' },
  ],
  'CH': [
    { url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400', caption: 'Swiss Alps' },
    { url: 'https://images.unsplash.com/photo-1544899489-a083461b088c?w=400', caption: 'Matterhorn' },
  ],
  'NO': [
    { url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400', caption: 'Northern Lights' },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', caption: 'Norwegian Fjords' },
  ],
  // Africa
  'EG': [
    { url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=400', caption: 'Pyramids of Giza' },
    { url: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=400', caption: 'Sphinx' },
  ],
  'ZA': [
    { url: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400', caption: 'Table Mountain' },
    { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400', caption: 'Safari Wildlife' },
  ],
  'KE': [
    { url: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=400', caption: 'Masai Mara' },
    { url: 'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=400', caption: 'Elephants' },
  ],
  'MA': [
    { url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=400', caption: 'Marrakech' },
    { url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400', caption: 'Sahara Desert' },
  ],
  'ET': [
    { url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=400', caption: 'Rock Churches of Lalibela' },
    { url: 'https://images.unsplash.com/photo-1580746738099-66bd8585a477?w=400', caption: 'Ethiopian Highlands' },
  ],
  // Asia
  'JP': [
    { url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400', caption: 'Mount Fuji' },
    { url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400', caption: 'Tokyo at Night' },
  ],
  'CN': [
    { url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400', caption: 'Great Wall of China' },
    { url: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=400', caption: 'Shanghai Skyline' },
  ],
  'IN': [
    { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400', caption: 'Taj Mahal' },
    { url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400', caption: 'Varanasi' },
  ],
  'TH': [
    { url: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400', caption: 'Thai Temples' },
    { url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400', caption: 'Thai Beach' },
  ],
  'VN': [
    { url: 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=400', caption: 'Ha Long Bay' },
    { url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400', caption: 'Rice Terraces' },
  ],
  'ID': [
    { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', caption: 'Bali Temple' },
    { url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400', caption: 'Raja Ampat' },
  ],
  'AE': [
    { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', caption: 'Burj Khalifa, Dubai' },
    { url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400', caption: 'Dubai Skyline' },
  ],
  'TR': [
    { url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400', caption: 'Cappadocia' },
    { url: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400', caption: 'Istanbul' },
  ],
  // Americas
  'US': [
    { url: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400', caption: 'Statue of Liberty' },
    { url: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400', caption: 'Grand Canyon' },
  ],
  'CA': [
    { url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=400', caption: 'Moraine Lake' },
    { url: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400', caption: 'Niagara Falls' },
  ],
  'MX': [
    { url: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400', caption: 'Chichen Itza' },
    { url: 'https://images.unsplash.com/photo-1547995886-6dc09384c6e6?w=400', caption: 'Mexico City' },
  ],
  'BR': [
    { url: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400', caption: 'Christ the Redeemer' },
    { url: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=400', caption: 'Amazon Rainforest' },
  ],
  'AR': [
    { url: 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=400', caption: 'Buenos Aires' },
    { url: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=400', caption: 'Patagonia' },
  ],
  'PE': [
    { url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400', caption: 'Machu Picchu' },
    { url: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=400', caption: 'Rainbow Mountain' },
  ],
  'CU': [
    { url: 'https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=400', caption: 'Havana' },
    { url: 'https://images.unsplash.com/photo-1570168606207-79289b09a051?w=400', caption: 'Classic Cars' },
  ],
  // Oceania
  'AU': [
    { url: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400', caption: 'Sydney Opera House' },
    { url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400', caption: 'Great Barrier Reef' },
  ],
  'NZ': [
    { url: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400', caption: 'Milford Sound' },
    { url: 'https://images.unsplash.com/photo-1469521669194-babb45599def?w=400', caption: 'Hobbiton' },
  ],
};

export function getCountryImages(alpha2Code) {
  return COUNTRY_IMAGES[alpha2Code] || null;
}
