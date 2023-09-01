import IdGenerator from "../idGenerator";

describe("IdGenerator", () => {
  
  test("undefined", () => {
    expect(IdGenerator.generateId(undefined)).toBeTruthy();
  });

  test("object", () => {
    expect(IdGenerator.generateId({ a: 1, b: 2 })).toBeTruthy();
  });

  test("repeated", () => {
    const obj = { a: 1, b: 2 };
    const id0 = IdGenerator.generateId(obj);
    const id1 = IdGenerator.generateId(obj);
    expect(id0).not.toEqual(id1);
  });
});
