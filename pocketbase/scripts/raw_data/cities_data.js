export const fallbackCityData = {
  Porto: {
    country: "Portugal",
    cost: 40,
    interesting: 85,
    transit: 75,
    description: "Historic riverside city known for port wine and stunning architecture",
    population: "215K",
    highlights: [
      "Port wine cellars",
      "Ribeira district",
      "Dom Luís I Bridge",
      "Serralves Museum",
      "Crystal Palace Gardens",
      "São Bento Station",
      "Casa da Música",
    ],
    reviews: {
      averageRating: 4.7,
      totalReviews: 3842,
    },
    destinationTypes: ["coastal", "historic", "culinary", "wineries", "cultural"],
    crowdLevel: 65, // Popular but not overwhelming
    recommendedStay: 70, // 4-5 days ideal
    bestSeason: 85, // Late spring through summer
    accessibility: 80, // International airport, good connections
  },
  Ljubljana: {
    country: "Slovenia",
    cost: 45,
    interesting: 80,
    transit: 85,
    description: "Charming capital with medieval castle and vibrant arts scene",
    population: "300K",
    highlights: [
      "Ljubljana Castle",
      "Triple Bridge",
      "Central Market",
      "Tivoli Park",
      "Metelkova district",
      "National Gallery",
      "Ljubljana Cathedral",
    ],
    reviews: {
      averageRating: 4.6,
      totalReviews: 2156,
    },
    destinationTypes: ["cultural", "historic", "arts", "digital-nomad"],
    crowdLevel: 45, // Less touristy than major capitals
    recommendedStay: 55, // 3 days ideal
    bestSeason: 70, // Late spring through early fall
    accessibility: 65, // Small international airport
  },
  Bologna: {
    country: "Italy",
    cost: 55,
    interesting: 90,
    transit: 80,
    description: "Medieval university town with exceptional cuisine and rich culture",
    population: "390K",
    highlights: [
      "Two Towers",
      "Quadrilatero district",
      "Food markets",
      "Piazza Maggiore",
      "San Petronio Basilica",
      "MAMbo Museum",
      "Margherita Gardens",
    ],
    reviews: {
      averageRating: 4.8,
      totalReviews: 2987,
    },
    destinationTypes: ["historic", "cultural", "culinary", "gastronomy", "arts"],
    crowdLevel: 50, // Authentic city, moderate tourism
    recommendedStay: 60, // 3-4 days ideal
    bestSeason: 65, // Spring/fall best, summer quite hot
    accessibility: 85, // Good airport, major rail hub
  },
  Valencia: {
    country: "Spain",
    cost: 50,
    interesting: 88,
    transit: 85,
    description: "Modern meets traditional in this vibrant Mediterranean city",
    population: "800K",
    highlights: [
      "City of Arts and Sciences",
      "Turia Gardens",
      "Central Market",
      "El Carmen district",
      "Valencia Cathedral",
      "Palau de la Música",
      "Torres de Serranos",
    ],
    reviews: {
      averageRating: 4.7,
      totalReviews: 4521,
    },
    destinationTypes: ["coastal", "metropolis", "cultural", "arts", "gastronomy"],
    crowdLevel: 70, // Popular but less than Barcelona
    recommendedStay: 75, // 4-5 days ideal
    bestSeason: 80, // Late spring through early fall
    accessibility: 85, // International airport, good connections
  },
  Ghent: {
    country: "Belgium",
    cost: 60,
    interesting: 85,
    transit: 90,
    description: "Medieval charm meets contemporary culture in this Flemish gem",
    population: "260K",
    highlights: [
      "Gravensteen Castle",
      "Patershol district",
      "SMAK Museum",
      "Korenmarkt",
      "St Bavo's Cathedral",
      "Blaarmeersen Recreation",
      "Vooruit Cultural Centre",
    ],
    reviews: {
      averageRating: 4.6,
      totalReviews: 1876,
    },
    destinationTypes: ["historic", "cultural", "arts"],
    crowdLevel: 55, // Less touristy than Bruges
    recommendedStay: 50, // 2-3 days ideal
    bestSeason: 65, // Spring through fall
    accessibility: 80, // Close to Brussels, great rail
  },
  Heidelberg: {
    country: "Germany",
    cost: 65,
    interesting: 82,
    transit: 88,
    description: "Romantic university town nestled in the Neckar Valley",
    population: "160K",
    highlights: [
      "Heidelberg Castle",
      "Old Bridge",
      "Philosopher's Way",
      "Altstadt district",
      "Student Prison",
      "Holy Spirit Church",
      "Heidelberg Theater",
    ],
    reviews: {
      averageRating: 4.5,
      totalReviews: 2245,
    },
    destinationTypes: ["historic", "cultural", "village", "arts"],
    crowdLevel: 65, // Popular university town
    recommendedStay: 45, // 2-3 days sufficient
    bestSeason: 70, // Late spring through early fall
    accessibility: 75, // Good rail connections, Frankfurt nearby
  },
  Bruges: {
    country: "Belgium",
    cost: 70,
    interesting: 90,
    transit: 80,
    description: "Fairytale-like city with canals, cobblestone streets, and medieval buildings",
    population: "120K",
    highlights: [
      "Belfry of Bruges",
      "Historic Centre of Bruges",
      "Groeningemuseum",
      "Canal boat tours",
      "Minnewater Lake",
      "Basilica of the Holy Blood",
    ],
    reviews: {
      averageRating: 4.9,
      totalReviews: 3000,
    },
    destinationTypes: ["historic", "cultural", "arts", "village"],
    crowdLevel: 85, // Very touristy
    recommendedStay: 45, // 2-3 days sufficient
    bestSeason: 65, // Year-round, summer peak
    accessibility: 75, // Easy train from Brussels
  },
  "Cesky Krumlov": {
    country: "Czech Republic",
    cost: 35,
    interesting: 85,
    transit: 70,
    description: "Picturesque town with a stunning castle and Renaissance-era old town",
    population: "12K",
    highlights: [
      "Český Krumlov Castle",
      "Old Town Square",
      "Egon Schiele Art Centrum",
      "Vltava River views",
      "St. Vitus Church",
      "Castle Garden",
    ],
    reviews: {
      averageRating: 4.8,
      totalReviews: 2100,
    },
    destinationTypes: ["historic", "cultural", "village", "arts"],
    crowdLevel: 75, // Very touristy in peak season
    recommendedStay: 35, // 1-2 days sufficient
    bestSeason: 70, // Late spring through early fall
    accessibility: 45, // Requires bus/car from larger cities
  },
  Tallinn: {
    country: "Estonia",
    cost: 50,
    interesting: 85,
    transit: 75,
    description: "A blend of medieval history and modern innovation on the Baltic Sea",
    population: "440K",
    highlights: [
      "Old Town",
      "Alexander Nevsky Cathedral",
      "Kadriorg Palace",
      "Telliskivi Creative City",
      "Lennusadam Seaplane Harbour",
      "Toompea Hill",
    ],
    reviews: {
      averageRating: 4.7,
      totalReviews: 1800,
    },
    destinationTypes: ["coastal", "historic", "cultural", "digital-nomad", "emerging"],
    crowdLevel: 60, // Growing in popularity
    recommendedStay: 55, // 3 days ideal
    bestSeason: 75, // Summer best, winter very cold
    accessibility: 70, // Good airport, ferry connections
  },
  Innsbruck: {
    country: "Austria",
    cost: 60,
    interesting: 83,
    transit: 90,
    description: "Austrian alpine city known for skiing, mountaineering, and rich history",
    population: "130K",
    highlights: ["Golden Roof", "Innsbruck Old Town", "Nordkette Cable Car", "Ambras Castle", "Bergisel Ski Jump", "Hofburg Palace"],
    reviews: {
      averageRating: 4.6,
      totalReviews: 1900,
    },
    destinationTypes: ["mountain", "historic", "winter", "adventure"],
    crowdLevel: 70, // Popular year-round
    recommendedStay: 55, // 3 days ideal
    bestSeason: 40, // Winter for skiing, summer hiking
    accessibility: 80, // Good airport, major rail route
  },
  Bergen: {
    country: "Norway",
    cost: 75,
    interesting: 88,
    transit: 80,
    description: "Gateway to the fjords with colorful wooden houses and scenic landscapes",
    population: "280K",
    highlights: ["Bryggen Wharf", "Mount Fløyen", "Fisketorget (Fish Market)", "Ulriken Cable Car", "Fantoft Stave Church", "Troldhaugen"],
    reviews: {
      averageRating: 4.7,
      totalReviews: 2500,
    },
    destinationTypes: ["coastal", "ports", "cultural", "adventure"],
    crowdLevel: 65, // Gateway to fjords
    recommendedStay: 60, // 3-4 days
    bestSeason: 75, // Summer best, winter very wet
    accessibility: 75, // Good airport, cruise port
  },
  Colmar: {
    country: "France",
    cost: 50,
    interesting: 87,
    transit: 75,
    description: "Quaint Alsatian town with half-timbered houses and canals",
    population: "70K",
    highlights: ["La Petite Venise", "Unterlinden Museum", "St Martin's Church", "Bartholdi Museum", "Old Town", "Dominican Church"],
    reviews: {
      averageRating: 4.8,
      totalReviews: 2100,
    },
    destinationTypes: ["village", "historic", "cultural", "wineries"],
    crowdLevel: 75, // Very touristy in season
    recommendedStay: 40, // 2 days sufficient
    bestSeason: 70, // Spring through fall, Christmas
    accessibility: 60, // Regional trains, nearby airports
  },
  Sorrento: {
    country: "Italy",
    cost: 65,
    interesting: 85,
    transit: 78,
    description: "Cliffside coastal town with sweeping views of the Bay of Naples",
    population: "16K",
    highlights: [
      "Marina Grande",
      "Piazza Tasso",
      "Villa Comunale Park",
      "Museo Correale",
      "Limoncello factories",
      "Cloister of San Francesco",
    ],
    reviews: {
      averageRating: 4.7,
      totalReviews: 1800,
    },
    destinationTypes: ["coastal", "culinary", "cultural"],
    crowdLevel: 80, // Very touristy
    recommendedStay: 70, // 4-5 days (base for Amalfi)
    bestSeason: 80, // Late spring through early fall
    accessibility: 65, // Train from Naples
  },
  "Rothenburg ob der Tauber": {
    country: "Germany",
    cost: 55,
    interesting: 92,
    transit: 70,
    description: "Perfectly preserved medieval town on the Romantic Road",
    population: "11K",
    highlights: ["Town Walls", "Plönlein", "Medieval Crime Museum", "Market Square", "St. Jakob's Church", "Burggarten"],
    reviews: {
      averageRating: 4.9,
      totalReviews: 2300,
    },
    destinationTypes: ["village", "historic", "cultural"],
    crowdLevel: 80, // Very touristy in peak
    recommendedStay: 35, // 1-2 days sufficient
    bestSeason: 65, // Spring through fall, Christmas
    accessibility: 50, // Requires train/car connections
  },
  Annecy: {
    country: "France",
    cost: 60,
    interesting: 88,
    transit: 78,
    description: "Lakeside town surrounded by mountains with a charming Old Town",
    population: "130K",
    highlights: ["Lake Annecy", "Annecy Old Town", "Palais de l'Isle", "Château d'Annecy", "Pont des Amours", "Semnoz Mountain"],
    reviews: {
      averageRating: 4.8,
      totalReviews: 2600,
    },
    destinationTypes: ["mountain", "village", "historic", "cultural"],
    crowdLevel: 70, // Popular in summer
    recommendedStay: 45, // 2-3 days ideal
    bestSeason: 80, // Summer best for lake
    accessibility: 60, // Near Geneva airport
  },
  Sintra: {
    country: "Portugal",
    cost: 40,
    interesting: 90,
    transit: 75,
    description: "Fairy tale-like town with romantic palaces and lush gardens",
    population: "380K",
    highlights: ["Pena Palace", "Quinta da Regaleira", "Moorish Castle", "Monserrate Palace", "Sintra National Palace", "Cabo da Roca"],
    reviews: {
      averageRating: 4.9,
      totalReviews: 3200,
    },
    destinationTypes: ["historic", "cultural", "forest"],
    crowdLevel: 85, // Very touristy
    recommendedStay: 45, // 2-3 days ideal
    bestSeason: 75, // Spring through fall
    accessibility: 75, // Easy trip from Lisbon
  },
  Kotor: {
    country: "Montenegro",
    cost: 35,
    interesting: 85,
    transit: 65,
    description: "Historic coastal town with a medieval fortress and stunning bay",
    population: "13K",
    highlights: [
      "Kotor Old Town",
      "Kotor Fortress",
      "Bay of Kotor",
      "St. Tryphon Cathedral",
      "Maritime Museum",
      "Church of Our Lady of Remedy",
    ],
    reviews: {
      averageRating: 4.7,
      totalReviews: 1800,
    },
    destinationTypes: ["coastal", "historic", "cultural", "ports"],
    crowdLevel: 75, // Very busy in summer
    recommendedStay: 50, // 2-3 days
    bestSeason: 75, // Late spring through early fall
    accessibility: 50, // Smaller airports, cruise port
  },
  Zermatt: {
    country: "Switzerland",
    cost: 85,
    interesting: 90,
    transit: 85,
    description: "Alpine village at the base of the Matterhorn, famous for skiing",
    population: "5K",
    highlights: ["Matterhorn", "Gornergrat Railway", "Zermatt Village", "Hiking trails", "Matterhorn Museum", "Sunnegga Paradise"],
    reviews: {
      averageRating: 4.9,
      totalReviews: 2100,
    },
    destinationTypes: ["mountain", "winter", "adventure", "village"],
    crowdLevel: 80, // Very touristy in peak seasons
    recommendedStay: 65, // 3-4 days ideal
    bestSeason: 20, // Winter peak for skiing, but also nice in summer (85)
    accessibility: 50, // No cars allowed, train transfer required
  },
  Hallstatt: {
    country: "Austria",
    cost: 55,
    interesting: 89,
    transit: 70,
    description: "Idyllic lakeside village with ancient salt mines and breathtaking views",
    population: "750",
    highlights: ["Salt Mines", "Hallstatt Skywalk", "Market Square", "Dachstein Caves", "Lake Hallstatt", "Hallstatt Museum"],
    reviews: {
      averageRating: 4.8,
      totalReviews: 2400,
    },
    destinationTypes: ["mountain", "village", "historic", "cultural"],
    crowdLevel: 90, // Extremely touristy
    recommendedStay: 35, // 1-2 days sufficient
    bestSeason: 70, // Spring through fall
    accessibility: 45, // Remote, requires connections
  },
  Ronda: {
    country: "Spain",
    cost: 50,
    interesting: 85,
    transit: 70,
    description: "Dramatic hilltop town split by a deep gorge with stunning views",
    population: "34K",
    highlights: ["Puente Nuevo", "Ronda Bullring", "El Tajo Gorge", "Arab Baths", "Palacio de Mondragón", "Jardines de Cuenca"],
    reviews: {
      averageRating: 4.7,
      totalReviews: 2000,
    },
    destinationTypes: ["historic", "cultural", "adventure"],
    crowdLevel: 70, // Popular daytrip
    recommendedStay: 40, // 2 days ideal
    bestSeason: 65, // Spring and fall best
    accessibility: 55, // Regional trains/buses required
  },
  Reine: {
    country: "Norway",
    cost: 80,
    interesting: 86,
    transit: 60,
    description: "Scenic fishing village in the Lofoten Islands with dramatic landscapes",
    population: "300",
    highlights: ["Reinebringen Hike", "Fishing Villages", "Northern Lights", "Sakrisøy", "Reinefjord", "Arctic Kayaking"],
    reviews: {
      averageRating: 4.8,
      totalReviews: 1500,
    },
    destinationTypes: ["coastal", "village", "adventure", "ports"],
    crowdLevel: 40, // Remote but gaining popularity
    recommendedStay: 45, // 2-3 days
    bestSeason: 65, // Summer for midnight sun, winter for aurora
    accessibility: 25, // Very remote, multiple transfers needed
  },
  Alberobello: {
    country: "Italy",
    cost: 50,
    interesting: 83,
    transit: 60,
    description: "Unique town known for its Trulli houses, a UNESCO World Heritage site",
    population: "11K",
    highlights: [
      "Trullo Sovrano",
      "Rione Monti",
      "Aia Piccola",
      "Museo del Territorio",
      "Church of St. Anthony",
      "Wine and Olive Oil Tours",
    ],
    reviews: {
      averageRating: 4.6,
      totalReviews: 1700,
    },
    destinationTypes: ["village", "historic", "cultural", "wineries"],
    crowdLevel: 75, // Touristy but manageable
    recommendedStay: 35, // 1-2 days sufficient
    bestSeason: 75, // Late spring through early fall
    accessibility: 45, // Requires connections from Bari
  },
  Carcassonne: {
    country: "France",
    cost: 55,
    interesting: 88,
    transit: 70,
    description: "Walled medieval city with a castle straight out of a fantasy novel",
    population: "46K",
    highlights: [
      "Cité de Carcassonne",
      "Château Comtal",
      "Basilica of Saint-Nazaire",
      "Canal du Midi",
      "Pont Vieux",
      "Carcassonne Museum of Fine Arts",
    ],
    reviews: {
      averageRating: 4.7,
      totalReviews: 2200,
    },
    destinationTypes: ["historic", "cultural", "ancient"],
    crowdLevel: 80, // Very touristy in season
    recommendedStay: 35, // 1-2 days sufficient
    bestSeason: 70, // Spring through fall
    accessibility: 60, // Regional airport, good trains
  },
  Piran: {
    country: "Slovenia",
    cost: 40,
    interesting: 82,
    transit: 65,
    description: "Charming coastal town with Venetian architecture and stunning views",
    population: "17K",
    highlights: ["Tartini Square", "Piran Walls", "St. George's Parish Church", "Piran Marina", "Aquarium Piran", "Fiesa Lake"],
    reviews: {
      averageRating: 4.6,
      totalReviews: 1600,
    },
    destinationTypes: ["coastal", "historic", "cultural", "ports"],
    crowdLevel: 60, // Moderately touristic
    recommendedStay: 40, // 2 days sufficient
    bestSeason: 80, // Summer best for beaches
    accessibility: 55, // Requires connection from Ljubljana
  },
  Gjirokaster: {
    country: "Albania",
    cost: 30,
    interesting: 80,
    transit: 60,
    description: "UNESCO-listed Ottoman-era town with unique stone architecture",
    population: "19K",
    highlights: [
      "Gjirokastër Castle",
      "Ethnographic Museum",
      "Bazaar Street",
      "Cold War Tunnel",
      "Ali Pasha Bridge",
      "Blue Eye Spring (nearby)",
    ],
    reviews: {
      averageRating: 4.5,
      totalReviews: 1300,
    },
    destinationTypes: ["historic", "cultural", "ancient", "emerging"],
    crowdLevel: 25, // Off the beaten path
    recommendedStay: 40, // 2-3 days sufficient
    bestSeason: 75, // Late spring through early fall
    accessibility: 30, // Remote, requires effort to reach
  },
  Chamonix: {
    country: "France",
    cost: 75,
    interesting: 89,
    transit: 80,
    description: "Alpine town famous for skiing, hiking, and breathtaking Mont Blanc views",
    population: "10K",
    highlights: ["Aiguille du Midi", "Montenvers Railway", "Glacier des Bossons", "Brevent Gondola", "Mer de Glace", "Chamonix Village"],
    reviews: {
      averageRating: 4.8,
      totalReviews: 2500,
    },
    destinationTypes: ["mountain", "winter", "adventure", "wellness"],
    crowdLevel: 75, // Very busy in peak seasons
    recommendedStay: 65, // 4 days ideal
    bestSeason: 30, // Winter peak, summer also good
    accessibility: 65, // Near Geneva airport
  },
  Bled: {
    country: "Slovenia",
    cost: 50,
    interesting: 87,
    transit: 75,
    description: "Lakeside town with a famous island church and medieval castle",
    population: "8K",
    highlights: ["Lake Bled", "Bled Castle", "Bled Island", "Vintgar Gorge", "Ojstrica Hike", "Church of the Assumption"],
    reviews: {
      averageRating: 4.9,
      totalReviews: 3800,
    },
    destinationTypes: ["mountain", "cultural", "adventure", "wellness"],
    crowdLevel: 80, // Very touristy in summer
    recommendedStay: 45, // 2-3 days ideal
    bestSeason: 75, // Summer best, winter also nice
    accessibility: 60, // Easy trip from Ljubljana
  },
  Mostar: {
    country: "Bosnia and Herzegovina",
    cost: 40,
    interesting: 85,
    transit: 70,
    description: "Historic city famed for its iconic bridge and Ottoman influences",
    population: "105K",
    highlights: [
      "Stari Most (Old Bridge)",
      "Kravica Waterfall",
      "Koski Mehmed Pasha Mosque",
      "Old Bazaar",
      "Blagaj Tekija",
      "Museum of Herzegovina",
    ],
    reviews: {
      averageRating: 4.7,
      totalReviews: 2300,
    },
    destinationTypes: ["historic", "cultural", "ancient", "emerging"],
    crowdLevel: 75, // Busy in peak season
    recommendedStay: 35, // 1-2 days sufficient
    bestSeason: 70, // Late spring through early fall
    accessibility: 45, // Limited transport options
  },
  Sighisoara: {
    country: "Romania",
    cost: 35,
    interesting: 82,
    transit: 65,
    description: "Colorful medieval town and birthplace of Vlad the Impaler",
    population: "28K",
    highlights: ["Clock Tower", "Citadel", "Vlad Dracul's House", "Church on the Hill", "Covered Stairway", "Tinsmiths' Tower"],
    reviews: {
      averageRating: 4.6,
      totalReviews: 1400,
    },
    destinationTypes: ["historic", "cultural", "ancient", "village"],
    crowdLevel: 45, // Less touristy
    recommendedStay: 35, // 1-2 days sufficient
    bestSeason: 70, // Late spring through early fall
    accessibility: 40, // Requires train/car connections
  },
  Nafplio: {
    country: "Greece",
    cost: 50,
    interesting: 85,
    transit: 70,
    description: "Charming seaside town steeped in Greek history and culture",
    population: "33K",
    highlights: ["Palamidi Fortress", "Bourtzi Castle", "Arvanitia Promenade", "Syntagma Square", "Archaeological Museum", "Acronauplia"],
    reviews: {
      averageRating: 4.7,
      totalReviews: 2000,
    },
    destinationTypes: ["coastal", "historic", "cultural", "ports"],
    crowdLevel: 60, // Popular with domestic tourism
    recommendedStay: 50, // 2-3 days ideal
    bestSeason: 75, // Late spring through early fall
    accessibility: 55, // Requires bus from Athens
  },
  Paris: {
    country: "France",
    cost: 70,
    interesting: 95,
    transit: 95,
    description: "The City of Light, famed for art, fashion, and iconic landmarks",
    population: "2.1M",
    highlights: [
      "Eiffel Tower",
      "Louvre Museum",
      "Notre-Dame Cathedral",
      "Montmartre",
      "Champs-Élysées",
      "Palace of Versailles",
      "Musée d'Orsay",
    ],
    reviews: {
      averageRating: 4.9,
      totalReviews: 25_000,
    },
    destinationTypes: ["metropolis", "cultural", "arts", "gastronomy"],
    crowdLevel: 95, // Extremely touristy
    recommendedStay: 90, // 5-7 days recommended
    bestSeason: 65, // Spring/Fall best, summer very crowded
    accessibility: 95, // Major hub, multiple airports
  },
  Rome: {
    country: "Italy",
    cost: 65,
    interesting: 98,
    transit: 85,
    description: "The Eternal City, rich in history, art, and culture",
    population: "2.8M",
    highlights: ["Colosseum", "Vatican City", "Pantheon", "Trevi Fountain", "Roman Forum", "Piazza Navona", "Sistine Chapel"],
    reviews: {
      averageRating: 4.8,
      totalReviews: 21_000,
    },
    destinationTypes: ["metropolis", "historic", "cultural", "ancient", "gastronomy"],
    crowdLevel: 95, // Extremely touristy
    recommendedStay: 90, // 5-7 days ideal
    bestSeason: 65, // Spring/fall best
    accessibility: 95, // Major hub, multiple airports
  },
  London: {
    country: "United Kingdom",
    cost: 75,
    interesting: 92,
    transit: 90,
    description: "Cosmopolitan capital known for its history, diversity, and modernity",
    population: "9M",
    highlights: [
      "British Museum",
      "Tower of London",
      "Big Ben and Houses of Parliament",
      "Buckingham Palace",
      "Tate Modern",
      "London Eye",
      "Westminster Abbey",
    ],
    reviews: {
      averageRating: 4.8,
      totalReviews: 23_000,
    },
    destinationTypes: ["metropolis", "cultural", "arts", "digital-nomad"],
    crowdLevel: 90, // Extremely touristy
    recommendedStay: 90, // 5-7 days ideal
    bestSeason: 60, // Spring/fall best
    accessibility: 100, // Major global hub
  },
  Barcelona: {
    country: "Spain",
    cost: 60,
    interesting: 90,
    transit: 85,
    description: "Catalan capital famed for Gaudí's architecture and vibrant culture",
    population: "1.6M",
    highlights: ["Sagrada Família", "Park Güell", "La Rambla", "Gothic Quarter", "Casa Batlló", "Montjuïc", "Camp Nou"],
    reviews: {
      averageRating: 4.7,
      totalReviews: 20_000,
    },
    destinationTypes: ["coastal", "metropolis", "cultural", "arts", "gastronomy"],
    crowdLevel: 90, // Extremely touristy
    recommendedStay: 85, // 5-6 days ideal
    bestSeason: 70, // Spring/fall best
    accessibility: 90, // Major airport hub
  },
  Amsterdam: {
    country: "Netherlands",
    cost: 65,
    interesting: 88,
    transit: 90,
    description: "Charming canal city known for its museums and liberal atmosphere",
    population: "870K",
    highlights: ["Rijksmuseum", "Van Gogh Museum", "Anne Frank House", "Canal cruises", "Vondelpark", "Dam Square", "Jordaan district"],
    reviews: {
      averageRating: 4.8,
      totalReviews: 18_000,
    },
    destinationTypes: ["cultural", "arts", "digital-nomad"],
    crowdLevel: 90, // Extremely touristy
    recommendedStay: 80, // 4-5 days ideal
    bestSeason: 65, // Spring/fall best
    accessibility: 95, // Major airport hub
  },
  Venice: {
    country: "Italy",
    cost: 70,
    interesting: 89,
    transit: 80,
    description: "Romantic city of canals and bridges with breathtaking views",
    population: "260K",
    highlights: [
      "St. Mark's Basilica",
      "Doge's Palace",
      "Grand Canal",
      "Rialto Bridge",
      "Murano Island",
      "Burano Island",
      "Peggy Guggenheim Collection",
    ],
    reviews: {
      averageRating: 4.7,
      totalReviews: 15_000,
    },
    destinationTypes: ["coastal", "historic", "cultural", "arts", "ports"],
    crowdLevel: 90, // Extremely touristy
    recommendedStay: 60, // 3-4 days ideal
    bestSeason: 60, // Spring/Fall best to avoid crowds/heat
    accessibility: 85, // Good airport, easy trains
  },
  Prague: {
    country: "Czech Republic",
    cost: 50,
    interesting: 93,
    transit: 90,
    description: "Fairy-tale city with a rich history and enchanting architecture",
    population: "1.3M",
    highlights: [
      "Prague Castle",
      "Charles Bridge",
      "Old Town Square",
      "Astronomical Clock",
      "St. Vitus Cathedral",
      "Petrin Tower",
      "Jewish Quarter",
    ],
    reviews: {
      averageRating: 4.9,
      totalReviews: 19_000,
    },
    destinationTypes: ["historic", "cultural", "arts", "digital-nomad"],
    crowdLevel: 90, // Extremely touristy
    recommendedStay: 75, // 4-5 days ideal
    bestSeason: 65, // Spring/fall best
    accessibility: 85, // Major airport, good connections
  },
  Florence: {
    country: "Italy",
    cost: 60,
    interesting: 91,
    transit: 75,
    description: "Renaissance city with artistic treasures and stunning vistas",
    population: "380K",
    highlights: [
      "Uffizi Gallery",
      "Florence Cathedral (Duomo)",
      "Ponte Vecchio",
      "Palazzo Pitti",
      "Piazzale Michelangelo",
      "Galleria dell'Accademia",
      "Basilica of Santa Croce",
    ],
    reviews: {
      averageRating: 4.8,
      totalReviews: 17_000,
    },
    destinationTypes: ["historic", "cultural", "arts", "gastronomy"],
    crowdLevel: 90, // Extremely touristy
    recommendedStay: 75, // 4-5 days ideal
    bestSeason: 65, // Spring/fall best
    accessibility: 80, // Good airport, excellent trains
  },
  Athens: {
    country: "Greece",
    cost: 55,
    interesting: 88,
    transit: 80,
    description: "Historic cradle of Western civilization with iconic landmarks",
    population: "3.1M",
    highlights: [
      "Acropolis and Parthenon",
      "Plaka district",
      "National Archaeological Museum",
      "Temple of Olympian Zeus",
      "Syntagma Square",
      "Monastiraki Flea Market",
      "Mount Lycabettus",
    ],
    reviews: {
      averageRating: 4.7,
      totalReviews: 14_000,
    },
    destinationTypes: ["historic", "cultural", "ancient", "coastal"],
    crowdLevel: 85, // Very touristy
    recommendedStay: 70, // 4-5 days ideal
    bestSeason: 70, // Spring/fall best
    accessibility: 85, // Major airport hub
  },
  Dubrovnik: {
    country: "Croatia",
    cost: 60,
    interesting: 87,
    transit: 75,
    description: "Pearl of the Adriatic, known for its stunning medieval walls and coastline",
    population: "42K",
    highlights: [
      "City Walls",
      "Old Town",
      "Fort Lovrijenac",
      "Cable Car to Mount Srđ",
      "Lokrum Island",
      "Stradun Street",
      "Dubrovnik Cathedral",
    ],
    reviews: {
      averageRating: 4.8,
      totalReviews: 12_000,
    },
    destinationTypes: ["coastal", "historic", "cultural", "ports"],
    crowdLevel: 90, // Extremely touristy in summer
    recommendedStay: 55, // 3 days ideal
    bestSeason: 65, // Spring/fall best
    accessibility: 75, // Airport, cruise port
  },
  Kyoto: {
    country: "Japan",
    cost: 70,
    interesting: 92,
    transit: 85,
    description: "Historic city filled with traditional temples, gardens, and geisha culture.",
    population: "1.46M",
    highlights: [
      "Kinkaku-ji (Golden Pavilion)",
      "Fushimi Inari Shrine",
      "Arashiyama Bamboo Grove",
      "Gion District",
      "Nijo Castle",
      "Kyoto Imperial Palace",
      "To-ji Temple",
    ],
    reviews: {
      averageRating: 4.9,
      totalReviews: 30_000,
    },
    destinationTypes: ["historic", "cultural", "scenic", "spiritual"],
    crowdLevel: 85,
    recommendedStay: 60,
    bestSeason: 90,
    accessibility: 85,
  },
  Istanbul: {
    country: "Turkey",
    cost: 55,
    interesting: 91,
    transit: 80,
    description: "A city where East meets West, boasting rich history, iconic architecture, and bustling bazaars.",
    population: "15.9M",
    highlights: ["Hagia Sophia", "Blue Mosque", "Grand Bazaar", "Topkapi Palace", "Bosphorus Cruise", "Basilica Cistern", "Galata Tower"],
    reviews: {
      averageRating: 4.8,
      totalReviews: 28_000,
    },
    destinationTypes: ["historic", "urban", "cultural", "ports"],
    crowdLevel: 80,
    recommendedStay: 60,
    bestSeason: 85,
    accessibility: 80,
  },
  Queenstown: {
    country: "New Zealand",
    cost: 65,
    interesting: 90,
    transit: 75,
    description: "Adventure capital of New Zealand, surrounded by stunning alpine landscapes.",
    population: "16K",
    highlights: [
      "Lake Wakatipu",
      "Skyline Queenstown Gondola",
      "Bungee Jumping",
      "Shotover Jet",
      "Hiking Trails",
      "Wine Tours",
      "Milford Sound Tours",
    ],
    reviews: {
      averageRating: 4.7,
      totalReviews: 12_000,
    },
    destinationTypes: ["adventure", "nature", "scenic", "cultural"],
    crowdLevel: 75,
    recommendedStay: 50,
    bestSeason: 85,
    accessibility: 70,
  },
  Cusco: {
    country: "Peru",
    cost: 50,
    interesting: 89,
    transit: 70,
    description: "Historic city and gateway to Machu Picchu, known for its Incan and colonial architecture.",
    population: "430K",
    highlights: [
      "Plaza de Armas",
      "Sacsayhuamán",
      "Qorikancha",
      "San Pedro Market",
      "Sacred Valley Tours",
      "Rainbow Mountain",
      "Machu Picchu (via train)",
    ],
    reviews: {
      averageRating: 4.8,
      totalReviews: 20_000,
    },
    destinationTypes: ["historic", "cultural", "scenic", "adventure"],
    crowdLevel: 80,
    recommendedStay: 55,
    bestSeason: 80,
    accessibility: 70,
  },
  Santorini: {
    country: "Greece",
    cost: 75,
    interesting: 85,
    transit: 65,
    description: "Idyllic island famous for its white-washed buildings, stunning sunsets, and crystal-clear waters.",
    population: "15K",
    highlights: [
      "Oia Village",
      "Red Beach",
      "Fira Town",
      "Caldera Cruises",
      "Akrotiri Archaeological Site",
      "Black Sand Beaches",
      "Santo Wines Winery",
    ],
    reviews: {
      averageRating: 4.7,
      totalReviews: 18_000,
    },
    destinationTypes: ["coastal", "romantic", "scenic", "cultural"],
    crowdLevel: 90,
    recommendedStay: 55,
    bestSeason: 85,
    accessibility: 70,
  },
  Salzburg: {
    country: "Austria",
    cost: 55,
    interesting: 86,
    transit: 70,
    description: "The birthplace of Mozart, famous for its baroque architecture and stunning Alpine surroundings.",
    population: "156K",
    highlights: [
      "Hohensalzburg Fortress",
      "Mirabell Palace and Gardens",
      "Mozart's Birthplace",
      "Salzburg Cathedral",
      "Getreidegasse Street",
      "Hellbrunn Palace",
      "Sound of Music Tour",
    ],
    reviews: {
      averageRating: 4.8,
      totalReviews: 15_000,
    },
    destinationTypes: ["historic", "cultural", "scenic", "urban"],
    crowdLevel: 75,
    recommendedStay: 50,
    bestSeason: 85,
    accessibility: 75,
  },
  Havana: {
    country: "Cuba",
    cost: 40,
    interesting: 88,
    transit: 60,
    description: "Cuba's vibrant capital, known for its colorful streets, historic landmarks, and lively music scene.",
    population: "2.1M",
    highlights: ["Old Havana", "Malecón", "El Capitolio", "Revolution Square", "Fusterlandia", "Morro Castle", "Tropicana Club"],
    reviews: {
      averageRating: 4.6,
      totalReviews: 12_000,
    },
    destinationTypes: ["cultural", "historic", "coastal", "urban"],
    crowdLevel: 70,
    recommendedStay: 50,
    bestSeason: 75,
    accessibility: 60,
  },
  Jaipur: {
    country: "India",
    cost: 30,
    interesting: 89,
    transit: 65,
    description: "The 'Pink City' of India, renowned for its stunning palaces, forts, and vibrant culture.",
    population: "3.1M",
    highlights: ["Amber Fort", "City Palace", "Hawa Mahal", "Jantar Mantar", "Jal Mahal", "Nahargarh Fort", "Markets of Jaipur"],
    reviews: {
      averageRating: 4.7,
      totalReviews: 18_000,
    },
    destinationTypes: ["historic", "cultural", "urban", "adventure"],
    crowdLevel: 80,
    recommendedStay: 55,
    bestSeason: 85,
    accessibility: 70,
  },
  Tromsø: {
    country: "Norway",
    cost: 75,
    interesting: 84,
    transit: 65,
    description: "The gateway to the Arctic, known for its Northern Lights, fjords, and midnight sun.",
    population: "76K",
    highlights: [
      "Arctic Cathedral",
      "Northern Lights Tours",
      "Fjellheisen Cable Car",
      "Polar Museum",
      "Tromsø Wilderness Center",
      "Husky Sledding",
      "Whale Watching",
    ],
    reviews: {
      averageRating: 4.8,
      totalReviews: 10_000,
    },
    destinationTypes: ["nature", "adventure", "scenic", "urban"],
    crowdLevel: 70,
    recommendedStay: 45,
    bestSeason: 90,
    accessibility: 65,
  },
};
