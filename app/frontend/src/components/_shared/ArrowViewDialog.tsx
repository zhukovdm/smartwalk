import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import type { Arrow, PlaceCategory } from "../../domain/types";
import ArrowList from "./ArrowList";
import ArrowDrawing from "./ArrowDrawing";

export type ArrowViewDialogProps = {

  /** Show dialog */
  show: boolean;

  /** User-defined categories */
  categories: PlaceCategory[];

  /** User-defined arrows */
  arrows: Arrow[];

  /** Callback hiding dialog */
  onHide: () => void;
};

/**
 * Read-only view of the arrow configuration with drawing and the list
 * of arrows.
 */
export default function ArrowViewDialog(
  { show, categories, arrows, onHide }: ArrowViewDialogProps): JSX.Element {

  const fullScreen = useMediaQuery(useTheme().breakpoints.down("sm"));

  return (
    <Dialog
      open={show}
      fullScreen={fullScreen}
      onClose={onHide}
    >
      <DialogTitle
        aria-label={"Arrows"}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span>Arrows</span>
        <IconButton
          size={"small"}
          title={"Hide dialog"}
          onClick={onHide}
        >
          <CloseIcon fontSize={"small"} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack mt={0.5} gap={2} maxWidth={"340px"}>
          {arrows.length > 0 &&
            <Paper
              role={"none"}
              variant={"outlined"}
            >
              <ArrowList arrows={arrows} />
            </Paper>
          }
          <ArrowDrawing
            categories={categories}
            arrows={arrows}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
