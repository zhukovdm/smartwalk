import { KeyboardEvent, useState } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
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
  onToggle: () => void;
};

/**
 * Filter corresponding to a passed category.
 */
export default function CategoryFilter(
  { found, active, index, category, onToggle }: CategoryFilterProps): JSX.Element {

  const [showDialog, setShowDialog] = useState(false);

  const catLabel = `${index + 1}: ${category.keyword}`;
  const chkLabel = `${active ? "Hide" : "Show"} places`;

  const keyboardAction = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      setShowDialog(true);
    }
  }

  return (
    <Box
      role={"listitem"}
      aria-label={catLabel}
    >
      <Stack
        alignItems={"center"}
        direction={"row"}
        gap={0.2}
        justifyContent={"center"}
      >
        <Checkbox
          inputProps={{ "aria-label": chkLabel }}
          title={chkLabel}
          disabled={!found}
          checked={active}
          onChange={onToggle}
        />
        <Box
          aria-label={`Show filters`}
          role={"button"}
          tabIndex={0}
          sx={{ cursor: "pointer", }}
          onKeyDown={keyboardAction}
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
