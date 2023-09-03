import {
  Path,
  UiDirec,
  UiPlace,
  UiRoute
} from "../domain/types";

const getPath = (): Path => ({
  distance: 3.0,
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
    name: "Source",
    placeId: "1" // stored!
  },
  target: {
    ...getPlace(),
    name: "Target"
  },
  distance: 5.0,
  categories: [
    { keyword: "castle", filters: {} },
    { keyword: "museum", filters: {} },
    { keyword: "statue", filters: {} },
    { keyword: "market", filters: {} },
    { keyword: "cinema", filters: {} }
  ],
  precedence: [
    { fr: 0, to: 3 },
    { fr: 1, to: 3 },
    { fr: 2, to: 3 },
    { fr: 3, to: 4 }
  ],
  path: getPath(),
  places: [
    {
      ...getPlace(),
      name: "Medieval castle",
      smartId: "A",
      categories: [0, 1]
    },
    {
      ...getPlace(),
      name: "Old statue",
      smartId: "B",
      categories: [2]
    },
    {
      ...getPlace(),
      name: "Flea market",
      smartId: "C",
      categories: [3]
    },
    {
      ...getPlace(),
      name: "Movie theater",
      smartId: "D",
      categories: [4]
    }
  ],
  waypoints: [
    { smartId: "B", category: 2 },
    { smartId: "A", category: 0 },
    { smartId: "A", category: 1 },
    { smartId: "C", category: 3 },
    { smartId: "D", category: 4 }
  ]
});
