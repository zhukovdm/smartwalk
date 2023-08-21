import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Typography
} from "@mui/material";
import { PlaceCategory, PrecedenceEdge } from "../../domain/types";
import PrecedenceDrawing from "../shared/PrecedenceDrawing";
import { CycleDetector } from "../../domain/cycle-detector";
import { East } from "@mui/icons-material";

type PrecedenceSelectorProps = {

  categories: PlaceCategory[];

  onSelect: (i: number) => void;
};

function PrecedenceSelector({ categories, onSelect }: PrecedenceSelectorProps): JSX.Element {

  const [value, setValue] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    const v = event.target.value;
    setValue(v);
    onSelect(Number(v));
  };

  return (
    <Select
      fullWidth
      onChange={handleChange}
      size={"small"}
      value={value}
    >
      {categories.map((c, i) => (
        <MenuItem key={i} value={i}>{`${i + 1}: ${c.keyword}`}</MenuItem>
      ))}
    </Select>
  )
}

type PrecedenceBoxProps = {

  /**  */
  categories: PlaceCategory[];

  /**  */
  precedence: PrecedenceEdge[];

  /**  */
  deleteEdge: (i: number) => void;

  /**  */
  appendEdge: (e: PrecedenceEdge) => void;
};

export default function PrecedenceBox(
  { categories, precedence, deleteEdge, appendEdge }: PrecedenceBoxProps): JSX.Element {

  const [showDialog, setShowDialog] = useState(false);
  const [edgeFr, setEdgeFr] = useState<number | undefined>(undefined);
  const [edgeTo, setEdgeTo] = useState<number | undefined>(undefined);
  const [edge, setEdge] = useState<PrecedenceEdge | undefined>(undefined);

  useEffect(() => {
    setEdge((edgeFr !== undefined && edgeTo !== undefined)
      ? { fr: edgeFr, to: edgeTo }
      : undefined);
  }, [edgeFr, edgeTo]);

  const discardAction = () => {
    setEdgeFr(undefined);
    setEdgeTo(undefined);
    setShowDialog(false);
  };

  const confirmAction = () => {
    const cycle = new CycleDetector(categories.length, [...precedence, edge!]).cycle();

    if (cycle !== undefined) {
      alert(`Detected cycle ${cycle.slice().map((v) => v + 1).join(" → ")}, try different arrow.`);
      return;
    }

    appendEdge(edge!);
    discardAction();
  };

  return (
    <Box>
      <Paper variant={"outlined"}>
        <Stack direction={"row"} flexWrap={"wrap"}>
          {precedence.map((edge, i) => (
            <Chip
              key={i}
              color={"primary"}
              sx={{ m: 0.35, color: "black" }}
              variant={"outlined"}
              label={`${edge.fr + 1} → ${edge.to + 1}`}
              onDelete={() => { deleteEdge(i); }}
            />
          ))}
        </Stack>
        <Button
          size={"large"}
          onClick={() => { setShowDialog(true); }}
          sx={{ width: "100%" }}
          title={"Open configuration dialog"}
        >
          <span>Add arrow</span>
        </Button>
      </Paper>
      <Dialog open={showDialog}>
        <DialogTitle>Add arrow</DialogTitle>
        <DialogContent>
          <Stack mt={0.5} gap={2} maxWidth={"380px"}>
            <Typography>
              Symbol &rarr; means relation <strong>before</strong>. Given
              &#123; 1, 2, 3 &#125; and only arrow 1 &rarr; 2, the following
              orders are valid:
            </Typography>
            <Stack mb={0.5} direction={"row"} justifyContent={"space-evenly"}>
              <Typography>1 &rarr; 2 &rarr; 3</Typography>
              <Typography>1 &rarr; 3 &rarr; 2</Typography>
              <Typography>3 &rarr; 1 &rarr; 2</Typography>
            </Stack>
            <PrecedenceDrawing
              edge={edge}
              categories={categories}
              precedence={precedence}
            />
            <Stack
              alignItems={"center"}
              direction={"row"}
              gap={2}
              justifyContent={"space-between"}
            >
              <PrecedenceSelector
                categories={categories}
                onSelect={(i: number) => { setEdgeFr(i); }}
              />
              <East />
              <PrecedenceSelector
                categories={categories}
                onSelect={(i: number) => { setEdgeTo(i); }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            color={"error"}
            onClick={discardAction}
          >
            <span>Discard</span>
          </Button>
          <Button
            disabled={edge === undefined}
            onClick={confirmAction}
          >
            <span>Confirm</span>
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
