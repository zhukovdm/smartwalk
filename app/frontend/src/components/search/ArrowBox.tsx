import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import EastIcon from "@mui/icons-material/East";
import type {
  PlaceCategory,
  PrecedenceEdge
} from "../../domain/types";
import CycleDetector from "../../utils/cycleDetector";
import ArrowList from "../_shared/ArrowList";
import ArrowDrawing from "../_shared/ArrowDrawing";

type ArrowSelectorProps = {

  /** Configured categories */
  categories: PlaceCategory[];

  /** Callback for a selected option. */
  onSelect: (i: number) => void;

  /** Accessible category label */
  "aria-label": string;
};

/**
 * Category selector defining one side (cat from, or cat to) of a new arrow.
 */
function ArrowSelector(
  { categories, onSelect, "aria-label": ariaLabel }: ArrowSelectorProps): JSX.Element {

  const [value, setValue] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    const v = event.target.value;
    setValue(v);
    onSelect(Number(v));
  };

  return (
    <Select
      aria-label={ariaLabel}
      fullWidth
      onChange={handleChange}
      size={"small"}
      value={value}
    >
      {categories.map((c, i) => (
        <MenuItem
          key={i}
          value={i.toString()}
        >
          {`${i + 1}: ${c.keyword}`}
        </MenuItem>
      ))}
    </Select>
  )
}

export type ArrowBoxProps = {

  /** Configured categories */
  categories: PlaceCategory[];

  /** Confirmed arrows */
  arrows: PrecedenceEdge[];

  /** Callback deleting an arrow */
  deleteArrow: (i: number) => void;

  /** Callback appending an arrow */
  appendArrow: (e: PrecedenceEdge) => void;
};

/**
 * Dialog for adding category arrows.
 */
export default function ArrowBox(
  { categories, arrows, deleteArrow, appendArrow }: ArrowBoxProps): JSX.Element {

  const fullScreen = useMediaQuery(useTheme().breakpoints.down("sm"));

  const [showDialog, setShowDialog] = useState(false);
  const [catFr, setCatFr] = useState<number | undefined>(undefined);
  const [catTo, setCatTo] = useState<number | undefined>(undefined);
  const [arrow, setArrow] = useState<PrecedenceEdge | undefined>(undefined);

  useEffect(() => {
    setArrow((catFr !== undefined && catTo !== undefined)
      ? { fr: catFr, to: catTo }
      : undefined);
  }, [catFr, catTo]);

  const discardAction = () => {
    setCatFr(undefined);
    setCatTo(undefined);
    setShowDialog(false);
  };

  const confirmAction = () => {

    if (!arrow) { return; }

    const repeated = arrows.some((e) => (e.fr === arrow.fr && e.to === arrow.to));

    if (repeated) {
      alert(`Repeated arrow ${arrow.fr + 1} → ${arrow.to + 1} detected, try another one.`);
      return;
    }

    const cycle = new CycleDetector(categories.length, [...arrows, arrow]).cycle();

    if (cycle !== undefined) {
      alert(`Cycle ${cycle.map((v) => v + 1).join(" → ")} detected, try another arrow.`);
      return;
    }

    appendArrow(arrow);
    discardAction();
  };

  return (
    <Box>
      <Paper
        role={"none"}
        variant={"outlined"}
      >
        <ArrowList
          arrows={arrows}
          onDelete={deleteArrow}
        />
        <Button
          size={"large"}
          onClick={() => { setShowDialog(true); }}
          sx={{ width: "100%" }}
        >
          <span>Add arrow</span>
        </Button>
      </Paper>
      <Dialog
        open={showDialog}
        fullScreen={fullScreen}
      >
        <DialogTitle>Add arrow</DialogTitle>
        <DialogContent
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Stack mt={0.5} gap={2} maxWidth={"340px"}>
            <ArrowDrawing
              arrow={arrow}
              categories={categories}
              arrows={arrows}
            />
            <Stack
              alignItems={"center"}
              direction={"row"}
              gap={2}
              justifyContent={"space-between"}
            >
              <ArrowSelector
                aria-label={"this category"}
                categories={categories}
                onSelect={(i: number) => { setCatFr(i); }}
              />
              <EastIcon titleAccess={"before"} />
              <ArrowSelector
                aria-label={"that category"}
                categories={categories}
                onSelect={(i: number) => { setCatTo(i); }}
              />
            </Stack>
            <Stack gap={1}>
              <Typography fontSize={"small"}>
                Symbol &rarr; has the same meaning as the word <em>&quot;before&quot;</em>. Given categories &#123;1,&nbsp;2,&nbsp;3&#125; and the only arrow (1&nbsp;&rarr;&nbsp;2), the following orders are valid:
              </Typography>
              <Stack
                direction={"row"}
                justifyContent={"space-evenly"}
                fontSize={"small"}
              >
                <Typography fontSize={"inherit"}>3&nbsp;&rarr;&nbsp;1&nbsp;&rarr;&nbsp;2</Typography>
                <Typography fontSize={"inherit"}>1&nbsp;&rarr;&nbsp;3&nbsp;&rarr;&nbsp;2</Typography>
                <Typography fontSize={"inherit"}>1&nbsp;&rarr;&nbsp;2&nbsp;&rarr;&nbsp;3</Typography>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            color={"error"}
            onClick={discardAction}
          >
            <span>Discard</span>
          </Button>
          <Button
            disabled={arrow === undefined}
            onClick={confirmAction}
          >
            <span>Confirm</span>
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
