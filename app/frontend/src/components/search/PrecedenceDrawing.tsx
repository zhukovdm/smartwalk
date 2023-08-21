import { useEffect, useRef } from "react";
import { Paper } from "@mui/material";
import { Edge, Network, Node, Options } from "vis-network";
import { PlaceCategory, PrecedenceEdge } from "../../domain/types";

type PrecedenceDrawingProps = {

  categories: PlaceCategory[];

  precedence: PrecedenceEdge[];

  edge?: PrecedenceEdge;
};

export default function PrecedenceDrawing(
  { categories, precedence, edge }: PrecedenceDrawingProps): JSX.Element {

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

    const edges: Edge[] = precedence.map(({ fr, to }) => ({
      from: fr, to: to, color: { color: "black" }
    }));

    if (edge) {
      edges.push({
        from: edge.fr, to: edge.to, color: { color: "red" }
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
  }, [visRef, categories, precedence, edge]);

  return (
    <Paper
      ref={visRef}
      sx={{ height: "300px", width: "100%" }}
      variant={"outlined"}
    />
  );
}
