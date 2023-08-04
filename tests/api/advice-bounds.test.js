const BOUNDS_BASE_URL = `${process.env.API_BASE_URL}/advice/bounds`;

test("well-formed", async () => {
  const res = await fetch(BOUNDS_BASE_URL);
  expect(res.status).toBe(200);
});
