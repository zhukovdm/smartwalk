var t;

// 200 (OK), simple

t = {
  "source": {
    "lon": 14.4035264,
    "lat": 50.0884344
  },
  "target": {
    "lon": 14.4048144,
    "lat": 50.0882872
  },
  "distance": 500,
  "categories": [
    {
      "keyword": "museum",
      "filters": {
        "existens": {},
        "booleans": {},
        "numerics": {},
        "textuals": {},
        "collects": {}
      }
    }
  ],
  "precedence": []
};

//

t = {
  "source": {
    "lon": 14.4035264,
    "lat": 50.0884344
  },
  "target": {
    "lon": 14.4048144,
    "lat": 50.0882872
  },
  "distance": 1000,
  "categories": [
    {
      "keyword": "museum",
      "filters": {
        "existens": {},
        "booleans": {},
        "numerics": {},
        "textuals": {},
        "collects": {}
      }
    },
    {
      "keyword": "tourism",
      "filters": {
        "existens": {},
        "booleans": {},
        "numerics": {},
        "textuals": {},
        "collects": {}
      }
    }
  ],
  "precedence": [
    { "fr": 0, "to": 1 }
  ]
};
