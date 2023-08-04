const PLACES_BASE_URL = `${process.env.API_BASE_URL}/entity/places`;
const EXISTING_SMART_ID = "64c91f8359914b93b23b01d9";
const NONEXISTENT_SMART_ID = "507f1f77bcf86cd799439011";

test("missing smartId", async () => {
  const r = await fetch(`${PLACES_BASE_URL}/`);
  expect(r.status).toBe(400);
});

test("malformed smartId", async () => {
  const r = await fetch(`${PLACES_BASE_URL}/a0`);
  expect(r.status).toBe(400);
});

test("non-existent smartId", async () => {
  const r = await fetch(`${PLACES_BASE_URL}/${NONEXISTENT_SMART_ID}`);
  expect(r.status).toBe(404);
});

test("existing smartId", async () => {
  const r = await fetch(`${PLACES_BASE_URL}/${EXISTING_SMART_ID}`);
  expect(r.status).toBe(200);
});
