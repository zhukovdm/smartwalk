import { useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import { Edge, Network, Node, Options } from "vis-network";
import type { Arrow, PlaceCategory } from "../../domain/types";

export type ArrowDrawingProps = {

  /** Configured categories */
  categories: PlaceCategory[];

  /** Confirmed arrows */
  arrows: Arrow[];

  /** New `red` arrow */
  arrow?: Arrow;
};

/**
 * Drawing of a category precedence graph. Vertices are cats, and edges are arrows.
 */
export default function ArrowDrawing(
  { categories, arrows, arrow }: ArrowDrawingProps): JSX.Element {

  const visRef = useRef<HTMLInputElement>(null);

  useEffect(() => {

    const nodes: Node[] = categories.map((c, i) => (
      {
        id: i,
        label: `${i + 1}: ${c.keyword}`,
        color: "#1976d2",
        font: {
          face: "Roboto"
        }
      }
    ));

    const edges: Edge[] = arrows.map(({ fr, to }) => ({
      from: fr, to: to, color: { color: "black" }
    }));

    if (arrow) {
      edges.push({
        from: arrow.fr, to: arrow.to, color: { color: "red" }
      });
    }

    const options: Options = {
      nodes: {
        size: 10,
        shape: "dot"
      },
      edges: {
        arrows: {
          to: {
            enabled: true
          }
        }
      },
      interaction: {
        hideEdgesOnDrag: true
      },
      layout: {
        randomSeed: 0
      }
    };

    (!!visRef?.current) && new Network(visRef.current, { nodes, edges }, options);
  }, [visRef, categories, arrows, arrow]);

  return (
    <Paper
      ref={visRef}
      sx={{ height: "300px", width: "100%" }}
      variant={"outlined"}
    />
  );
}
