import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {
  PlaceCategory,
  PrecedenceEdge
} from "../../domain/types";
import PrecedenceList from "./PrecedenceList";
import PrecedenceDrawing from "./PrecedenceDrawing";

type PrecedenceViewDialogProps = {

  /** Show dialog */
  show: boolean;

  /** User-defined categories */
  categories: PlaceCategory[];

  /** User-defined arrows */
  precedence: PrecedenceEdge[];

  /** Callback hiding dialog */
  onHide: () => void;
};

/**
 * Read-only view of precedence configuration with drawing and the list
 * of arrows.
 */
export default function PrecedenceViewDialog(
  { show, categories, precedence, onHide }: PrecedenceViewDialogProps): JSX.Element {

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
        <Stack mt={0.5} gap={2} maxWidth={"360px"}>
          {precedence.length > 0 &&
            <Paper
              role={"none"}
              variant={"outlined"}
            >
              <PrecedenceList precedence={precedence} />
            </Paper>
          }
          <PrecedenceDrawing
            categories={categories}
            precedence={precedence}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
