import type { PrecedenceEdge } from "../../domain/types";
import CycleDetector from "../cycleDetector";

describe("CycleDetector", () => {

  test("valid input, small graph", () => {
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

  test("valid input, large graph", () => {
    const precedence: PrecedenceEdge[] = [];

    for (let fr = 0; fr < 100; ++fr) {
      for (let to = fr + 1; to < 100; ++to) {
        precedence.push({ fr, to });
      }
    }
    expect(new CycleDetector(100, precedence).cycle()).toEqual(undefined);
  });

  test("loop", () => {
    const precedence = [
      { fr: 3, to: 3 }
    ];
    expect(new CycleDetector(8, precedence).cycle()).toEqual([3, 3]);
  });

  test("cycle with two vertices", () => {
    const precedence = [
      { fr: 5, to: 15 },
      { fr: 15, to: 5 }
    ];
    expect(new CycleDetector(20, precedence).cycle()).toEqual([5, 15, 5]);
  });

  test("cycle with N vertices (first and last vertices shall be equal)", () => {
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
