import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { PrecedenceEdge } from "../../domain/types";

export type PrecedenceListProps = {

  /** Confirmed arrows */
  precedence: PrecedenceEdge[];

  /** Callback deleting an arrow */
  onDelete?: (index: number) => void;
};

export default function PrecedenceList(
  { precedence, onDelete }: PrecedenceListProps): JSX.Element {

  return (
    <Stack
      aria-label={"Arrows"}
      role={"list"}
      direction={"row"}
      flexWrap={"wrap"}
    >
      {precedence.map((edge, i) => (
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
