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
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { East } from "@mui/icons-material";
import { PlaceCategory, PrecedenceEdge } from "../../domain/types";
import { CycleDetector } from "../../domain/cycle-detector";
import PrecedenceDrawing from "./PrecedenceDrawing";

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

  const fullScreen = useMediaQuery(useTheme().breakpoints.down("sm"));

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
      <Dialog open={showDialog} fullScreen={fullScreen}>
        <DialogTitle>Add arrow</DialogTitle>
        <DialogContent>
          <Stack mt={0.5} gap={2} maxWidth={"360px"}>
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
            <Typography fontSize={"small"}>
              Symbol &rarr; means relation <strong>before</strong>. Given
              categories &#123;&nbsp;1,&nbsp;2,&nbsp;3&nbsp;&#125; and only
              arrow 1&nbsp;&rarr;&nbsp;2, the following orders are valid:
            </Typography>
            <Stack
              direction={"row"}
              justifyContent={"space-evenly"}
              fontSize={"small"}
            >
              <Typography fontSize={"inherit"}>1&nbsp;&rarr;&nbsp;2&nbsp;&rarr;&nbsp;3</Typography>
              <Typography fontSize={"inherit"}>1&nbsp;&rarr;&nbsp;3&nbsp;&rarr;&nbsp;2</Typography>
              <Typography fontSize={"inherit"}>3&nbsp;&rarr;&nbsp;1&nbsp;&rarr;&nbsp;2</Typography>
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
