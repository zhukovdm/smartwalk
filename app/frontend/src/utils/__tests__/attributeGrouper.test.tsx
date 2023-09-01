import AttributeGrouper from "../attributeGrouper";

describe("AttributeGrouper", () => {

  test("group", () => {
    const attributes = [
      "image",
      "takeaway",
      "capacity",
      "name",
      "clothes"
    ];
    const { es, bs, ns, ts, cs } = AttributeGrouper.group(attributes);
    expect(es).toEqual(["image"]);
    expect(bs).toEqual(["takeaway"]);
    expect(ns).toEqual(["capacity"]);
    expect(ts).toEqual(["name"]);
    expect(cs).toEqual(["clothes"]);
  });

  test("skip unknown", () => {
    const attributes = ["unknown"];
    const { es, bs, ns, ts, cs } = AttributeGrouper.group(attributes);
    [es, bs, ns, ts, cs].forEach((xs) => { expect(xs).toEqual([]); });
  });
});
