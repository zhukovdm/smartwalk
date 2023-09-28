import { PrecedenceEdge } from "../domain/types";

enum Color {
  A,
  B,
  C
};

type Vertex = {
  color: Color;
  predecessor: number;
};

/**
 * Detect cycles in a directed graph (standard 3-color recursive procedure).
 */
export default class CycleDetector {

  static getArrayBase(order: number) {
    return Array(order).fill(undefined);
  }

  static getCycleDetectorV(): Vertex {
    return { color: Color.A, predecessor: -1 };
  }

  private cycleRef = -1;
  private readonly vs: Vertex[];
  private readonly es: Set<number>[];

  constructor(order: number, arrows: PrecedenceEdge[]) {
    this.vs = CycleDetector
      .getArrayBase(order)
      .map(() => CycleDetector.getCycleDetectorV());

    this.es = CycleDetector
      .getArrayBase(order).map(() => new Set<number>());

    arrows.forEach(({ fr, to }) => this.es[fr].add(to));
  }

  private cycleImpl(u: number): boolean {
    this.vs[u].color = Color.B;

    for (const v of Array.from(this.es[u])) {
      this.vs[v].predecessor = u;
      switch (this.vs[v].color) {
        case Color.A:
          if (this.cycleImpl(v)) { return true; }
          break;
        case Color.B:
          this.cycleRef = v;
          return true;
      }
    }

    this.vs[u].color = Color.C;
    return false;
  }

  public cycle(): number[] | undefined {
    const res: number[] = [];

    for (let u = 0; u < this.vs.length; ++u) {
      if (this.vs[u].color === Color.A && this.cycleImpl(u)) { break; }
    }

    if (this.cycleRef > -1) {
      let cur = this.cycleRef;
      do {
        res.push(cur);
        cur = this.vs[cur].predecessor;
      } while (cur !== this.cycleRef);
      res.push(cur);
    }

    return res.length > 0 ? res.reverse() : undefined;
  }
}
