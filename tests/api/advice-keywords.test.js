const KEYWORDS_BASE_URL = `${process.env.API_BASE_URL}/advice/keywords?`;

test("empty query", async () => {
  const r = await fetch(KEYWORDS_BASE_URL);
  expect(r.status).toBe(400);
});

test("missing prefix", async () => {
  const q = new URLSearchParams({ count: 3 });
  const r = await fetch(KEYWORDS_BASE_URL + q);
  expect(r.status).toBe(400);
});

test("too short prefix", async () => {
  const q = new URLSearchParams({ prefix: "", count: 3 });
  const r = await fetch(KEYWORDS_BASE_URL + q);
  expect(r.status).toBe(400);
});

test("missing count", async () => {
  const q = new URLSearchParams({ prefix: "m" });
  const r = await fetch(KEYWORDS_BASE_URL + q);
  expect(r.status).toBe(400);
});

test("too small count", async () => {
  const q = new URLSearchParams({ prefix: "m", count: 0 });
  const r = await fetch(KEYWORDS_BASE_URL + q);
  expect(r.status).toBe(400);
});

test("extra parameter", async () => {
  const q = new URLSearchParams({ prefix: "m", count: 1, extra: 0 });
  const r = await fetch(KEYWORDS_BASE_URL + q);
  expect(r.status).toBe(200);
});

test("well-formed", async () => {
  const q = new URLSearchParams({ prefix: "m", count: 3 });
  const r = await fetch(KEYWORDS_BASE_URL + q);
  expect(r.status).toBe(200);
});
