import type {
  AttributeFilters,
  ExtendedPlace,
  KeywordAdviceItem,
  Path,
  UiDirec,
  UiPlace,
  UiRoute
} from "../domain/types";

export const getPath = (): Path => ({
  distance: 3.1,
  duration: 900,
  polyline: [
    { lon: 0.0, lat: 0.0 },
    { lon: 1.0, lat: 1.0 },
    { lon: 2.0, lat: 2.0 }
  ]
});

export const getPlace = (): UiPlace => ({
  name: "",
  location: { lon: 0.0, lat: 0.0 },
  keywords: [],
  categories: []
});

export const getExtendedPlace = (): ExtendedPlace => ({
  smartId: "A",
  name: "Medieval castle",
  location: { lon: 0.0, lat: 0.0 },
  keywords: [
    "castle",
    "museum",
    "restaurant"
  ],
  categories: [],
  linked: {
    dbpedia: "Medieval_Castle",
    geonames: "1",
    mapycz: "base&id=1",
    osm: "node/1",
    wikidata: "Q1",
    yago: "Medieval_Castle"
  },
  attributes: {
    polygon: [
      { lon: 0.0, lat: 0.0 },
      { lon: 0.0, lat: 1.0 },
      { lon: 1.0, lat: 1.0 },
      { lon: 1.0, lat: 0.0 },
      { lon: 0.0, lat: 0.0 }
    ],
    description: "You definitely should see it!",
    image: "https://www.medieval.com/picture.png",
    website: "https://www.medieval.com/",
    address: {
      country: "Czech Republic",
      settlement: "Prague",
      district: "Prague 1",
      place: "Malostranske namesti",
      house: "1",
      postalCode: "100 00"
    },
    email: "medieval@castle.com",
    phone: "+420 123 456 789",
    socialNetworks: {
      facebook: "a",
      instagram: "b",
      linkedin: "c",
      pinterest: "d",
      telegram: "e",
      twitter: "f",
      youtube: "g"
    },
    charge: [
      "200 CZK per hour",
      "children under 10 free of charge"
    ],
    openingHours: [
      "Mon 08:00 - 16:30",
      "Tue 08:00 - 16:30",
      "Wed 08:00 - 16:30",
      "Thu closed",
      "Fri 08:00 - 16:30",
      "Sat 09:00 - 14:00",
      "Sun closed"
    ],
    fee: true,
    delivery: undefined,
    drinkingWater: true,
    internetAccess: false,
    shower: undefined,
    smoking: false,
    takeaway: false,
    toilets: true,
    wheelchair: true,
    capacity: 300,
    elevation: undefined,
    minimumAge: 1,
    rating: 5,
    year: 1645,
    clothes: [
      "shirts",
      "trousers"
    ],
    cuisine: [
      "czech",
      "oriental"
    ],
    denomination: [
      "a",
      "b",
      "c"
    ],
    payment: [
      "cash",
      "bitcoin",
      "visa"
    ],
    rental: [
      "binoculars"
    ]
  }
})

export const getDirec = (): UiDirec => ({
  name: "",
  path: getPath(),
  waypoints: [
    // location-based (no Id)
    {
      ...getPlace(),
      name: "Place A"
    },
    // stored
    {
      ...getPlace(),
      name: "Place B",
      placeId: "2",
    },
    // deleted
    {
      ...getPlace(),
      name: "Place C",
      placeId: "3"
    },
    // stored by smartId
    {
      ...getPlace(),
      name: "Place D",
      smartId: "D"
    },
    // unknown by smartId
    {
      ...getPlace(),
      name: "Place E",
      smartId: "E"
    }
  ]
});

export const getRoute = (): UiRoute => ({
  name: "",
  source: {
    ...getPlace(),
    name: "Source S",
    placeId: "1", // stored!
    smartId: "S"
  },
  target: {
    ...getPlace(),
    placeId: "2", // stored!
    name: "Target T"
  },
  maxDistance: 5,
  categories: [
    { keyword: "castle", filters: {} },
    { keyword: "museum", filters: {} },
    { keyword: "statue", filters: {} },
    { keyword: "market", filters: {} },
    { keyword: "cinema", filters: {} }
  ],
  arrows: [
    { fr: 0, to: 3 },
    { fr: 1, to: 3 },
    { fr: 2, to: 3 },
    { fr: 3, to: 4 }
  ],
  path: getPath(),
  places: [
    // common & repeated
    {
      ...getPlace(),
      name: "Place A",
      smartId: "A",
      categories: [0, 1]
    },
    // common
    {
      ...getPlace(),
      name: "Place B",
      smartId: "B",
      categories: [2]
    },
    // stored
    {
      ...getPlace(),
      name: "Place C",
      smartId: "C",
      categories: [3]
    },
    // common
    {
      ...getPlace(),
      name: "Place D",
      smartId: "D",
      categories: [4]
    }
  ],
  waypoints: [
    { smartId: "B", category: 2 }, // statue
    { smartId: "A", category: 0 }, // castle
    { smartId: "A", category: 1 }, // museum
    { smartId: "C", category: 3 }, // market
    { smartId: "D", category: 4 }, // cinema
  ]
});

export const getKeywordAdviceItem = (): KeywordAdviceItem => ({
  keyword: "Keyword A",
  attributeList: [
    "website", // e
    "delivery", // b
    "capacity", // n
    "name", // t
    "cuisine" // c
  ],
  numericBounds: {
    capacity: {
      min: 0,
      max: 100
    }
  },
  collectBounds: {
    cuisine: [
      "a",
      "b"
    ]
  }
});

export const getAttributeFilters = (): AttributeFilters => ({
  es: {
    website: {}
  },
  bs: {
    delivery: false
  },
  ns: {
    capacity: {
      min: 20,
      max: 80
    }
  },
  ts: {
    name: "Abc"
  },
  cs: {
    cuisine: {
      inc: ["a"],
      exc: ["b"]
    }
  }
});
