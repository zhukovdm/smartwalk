import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { PrecedenceEdge } from "../../domain/types";

export type ArrowListProps = {

  /** Confirmed arrows */
  arrows: PrecedenceEdge[];

  /** Callback deleting an arrow */
  onDelete?: (index: number) => void;
};

/**
 * List of arrows presented to the user.
 */
export default function ArrowList({ arrows, onDelete }: ArrowListProps): JSX.Element {

  return (
    <Stack
      aria-label={"Arrows"}
      role={"list"}
      direction={"row"}
      flexWrap={"wrap"}
    >
      {arrows.map((edge, i) => (
        <Box
          key={i}
          role={"listitem"}
        >
          <Chip
            color={"primary"}
            sx={{ m: 0.35, color: "black" }}
            variant={"outlined"}
            label={`${edge.fr + 1} → ${edge.to + 1}`}
            onDelete={!!onDelete ? () => { onDelete(i); } : undefined}
          />
        </Box>
      ))}
    </Stack>
  );
}
