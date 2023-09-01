import {
  camelCaseToLabel,
  deleteItemImmutable,
  fromToItemImmutable,
  updateItemImmutable
} from "../functions";

describe("functions", () => {
  
  describe("deleteItemImmutable", () => {

    test("new ref", () => {
      const a0 = [1];
      const a1 = deleteItemImmutable(a0, 0);
      expect(a0).not.toBe(a1);
    });

    test("delete item", () => {
      const a0 = [0, 1, 2];
      const a1 = deleteItemImmutable(a0, 1);
      expect(a0).toEqual([0, 1, 2]);
      expect(a1).toEqual([0, 2]);
    });

    test("empty array", () => {
      expect(deleteItemImmutable([], 3)).toEqual([]);
    });

    test("out bound", () => {
      const a0 = [0, 1, 2];
      const a1 = deleteItemImmutable(a0, 3);
      expect(a0).toEqual([0, 1, 2]);
      expect(a1).toEqual([0, 1, 2]);
    });
  });

  describe("updateItemImmutable", () => {

    test("new ref", () => {
      const a0 = [1];
      const a1 = updateItemImmutable(a0, 0, 1);
      expect(a0).not.toBe(a1);
    });

    test("update item", () => {
      const a0 = [0, 1, 2];
      const a1 = updateItemImmutable(a0, 3, 1);
      expect(a0).toEqual([0, 1, 2]);
      expect(a1).toEqual([0, 3, 2]);
    });

    test("empty array", () => {
      const a0: number[] = [];
      const a1 = updateItemImmutable(a0, 1, 1);
      expect(a1).toEqual([1]);
    });

    test("out bound", () => {
      const a0 = [0, 1, 2];
      const a1 = updateItemImmutable(a0, 3, 3);
      expect(a0).toEqual([0, 1, 2]);
      expect(a1).toEqual([0, 1, 2, 3]);
    });
  });

  describe("fromToItemImmutable", () => {

    test("new ref", () => {
      const a0 = [1, 2];
      const a1 = fromToItemImmutable(a0, 0, 1);
      expect(a0).not.toBe(a1);
    });

    test("swap items", () => {
      const a0 = [0, 1, 2];
      const a1 = fromToItemImmutable(a0, 0, 2);
      expect(a0).toEqual([0, 1, 2]);
      expect(a1).toEqual([1, 2, 0]);
    });

    test("stay on the same place", () => {
      const a0 = [0, 1, 2];
      const a1 = fromToItemImmutable(a0, 1, 1);
      expect(a0).toEqual([0, 1, 2]);
      expect(a1).toEqual([0, 1, 2]);
    });

    test("array with one element", () => {
      const a0 = [0];
      const a1 = fromToItemImmutable(a0, 0, 0);
      expect(a0).toEqual([0]);
      expect(a1).toEqual([0]);
    });
  });

  describe("camelCaseToLabel", () => {

    test("empty string", () => {
      expect(camelCaseToLabel("")).toEqual("");
    });

    test("opening hours", () => {
      expect(camelCaseToLabel("openingHours")).toEqual("opening hours");
    });

    test("Arrows", () => {
      expect(camelCaseToLabel("Arrows")).toEqual(" arrows");
    });
  });
});
