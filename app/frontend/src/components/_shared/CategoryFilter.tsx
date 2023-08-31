import { KeyboardEvent, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { PlaceCategory } from "../../domain/types";
import CategoryFilterDialog from "./CategoryFilterDialog";

type CategoryFilterProps = {

  /** Indicate if the user has selected this filter */
  active: boolean;

  /** Flag is set if this category is satisfied by some place */
  found: boolean;

  /** Index of a category in the list. */
  index: number;

  /** Category that forms a filter. */
  category: PlaceCategory;

  /** Toggle filter selection */
  onToggle: (index: number) => void;
};

/**
 * Filter corresponding to a passed category.
 */
export default function CategoryFilter(
  { found, active, index, category, onToggle }: CategoryFilterProps): JSX.Element {

  const [showDialog, setShowDialog] = useState(false);

  const catLabel = `${index + 1}: ${category.keyword}`;
  const chkLabel = `${active ? "Hide" : "Show"} places`;

  const chkKeyAction = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
    }
    if (e.key === " ") { onToggle(index); }
  }

  const fltKeyAction = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      setShowDialog(true);
    }
  }

  return (
    <Box>
      <Stack
        alignItems={"center"}
        direction={"row"}
        gap={0.5}
        justifyContent={"center"}
        role={"listitem"}
        aria-label={catLabel}
      >
        <IconButton
          color={"primary"}
          disabled={!found}
          role={"checkbox"}
          aria-checked={active}
          size={"small"}
          title={chkLabel}
          onKeyDown={chkKeyAction}
          onClick={() => { onToggle(index); }}
        >
          {active
            ? <CheckBoxIcon />
            : <CheckBoxOutlineBlankIcon />
          }
        </IconButton>
        <Box
          title={"Show filters"}
          aria-label={"Show filters"}
          role={"button"}
          tabIndex={0}
          sx={{ cursor: "pointer" }}
          onKeyDown={fltKeyAction}
          onClick={() => { setShowDialog(true); }}
        >
          <Typography
            sx={
              {
                color: found ? undefined : "grey",
                textDecorationLine: found ? undefined : "line-through"
              }
            }
          >
            {catLabel}
          </Typography>
        </Box>
      </Stack>
      <CategoryFilterDialog
        category={category}
        show={showDialog}
        onHide={() => { setShowDialog(false); }}
      />
    </Box>
  );
}
