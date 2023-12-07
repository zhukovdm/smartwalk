import axios from "axios";

const url = "http://localhost:3000/api/search/routes?query=";

const arrowsQueryObject = () => ({
  source: {
    lon: 0.0,
    lat: 0.0
  },
  target: {
    lon: 0.0,
    lat: 0.0
  },
  maxDistance: 3.0,
  categories: [
    {
      keyword: "castle",
      filters: {}
    },
    {
      keyword: "museum",
      filters: {}
    },
    {
      keyword: "statue",
      filters: {}
    }
  ],
  arrows: [
    { fr: 0, to: 1 },
    { fr: 1, to: 2 },
    { fr: 2, to: 0 }
  ]
});

async function main() {
  const qry = JSON.stringify(arrowsQueryObject());
  const response = await axios.get(url + encodeURIComponent(qry), {
    method: "GET",
    headers: {
      "Accept": "application/json; charset=utf-8"
    },
    validateStatus: null
  });
  console.log(response.status);
  console.log(JSON.stringify(response.data, null, 2));
}

main();
