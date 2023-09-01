import CycleDetector from "../cycleDetector";

describe("CycleDetector", () => {

  test("dag", () => {
    const precedence = [
      { fr: 0, to: 4 },
      { fr: 1, to: 4 },
      { fr: 2, to: 5 },
      { fr: 3, to: 5 },
      { fr: 4, to: 6 },
      { fr: 5, to: 6 }
    ];
    expect(new CycleDetector(7, precedence).cycle()).toEqual(undefined);
  });

  test("c1", () => {
    const precedence = [
      { fr: 3, to: 3 }
    ];
    expect(new CycleDetector(8, precedence).cycle()).toEqual([3, 3]);
  });

  test("c2", () => {
    const precedence = [
      { fr: 5, to: 15 },
      { fr: 15, to: 5 }
    ];
    expect(new CycleDetector(20, precedence).cycle()).toEqual([5, 15, 5]);
  });

  test("cN", () => {
    const precedence = [
      { fr: 0, to: 4 },
      { fr: 1, to: 4 },
      { fr: 2, to: 5 },
      { fr: 3, to: 5 },
      { fr: 4, to: 6 },
      { fr: 5, to: 6 },
      { fr: 6, to: 1 }
    ];
    expect(new CycleDetector(7, precedence).cycle()).toEqual([4, 6, 1, 4]);
  });
});
