const DIRECS_BASE_URL = `${process.env.API_BASE_URL}/search/direcs?`;

test("missing query", async () => {
  const r = await fetch(DIRECS_BASE_URL);
  expect(r.status).toBe(400);
});

test("empty query", async () => {
  const q = new URLSearchParams({ query: "" });
  const r = await fetch(DIRECS_BASE_URL + q);
  expect(r.status).toBe(400);
});

test("query as malformed JSON values", async () => {
  const q = new URLSearchParams({ query: "{1}" });
  const r = await fetch(DIRECS_BASE_URL + q);
  expect(r.status).toBe(400);
});

test("query as invalid JSON value", async () => {
  const q = new URLSearchParams({ query: "{}" });
  const r = await fetch(DIRECS_BASE_URL + q);
  expect(r.status).toBe(400);
});

test("query with too short list of waypoints", async () => {
  const q = {
    waypoints: [
      { lon: 0.0, lat: 0.0 }
    ]
  };
  const r = await fetch(DIRECS_BASE_URL + QUERY_PREFIX + encodeURIComponent(JSON.stringify(q)));
  expect(r.status).toBe(400);
});

test("well-formed", async () => {
  const q = {
    waypoints: [
      { lon: 0.0, lat: 0.0 },
      { lon: 1.0, lat: 1.0 },
    ]
  };
  const r = await fetch(DIRECS_BASE_URL + new URLSearchParams({ query: JSON.stringify(q) }));
  expect(r.status).toBe(200);
});
