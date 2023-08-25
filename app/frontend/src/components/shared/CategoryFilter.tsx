import { useState } from "react";
import {
  Box,
  Checkbox,
  Stack,
  Typography
} from "@mui/material";
import { PlaceCategory } from "../../domain/types";
import CategoryFilterDialog from "./CategoryFilterDialog";

type CategoryFilterProps = {

  /** Flag is set if this category is satisfied by some place */
  found: boolean;

  /** Indicate if the user has selected this filter */
  active: boolean;

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
  const label = `${active ? "Hide" : "Show"} "${category.keyword}" items`;

  return (
    <Box>
      <Stack
        alignItems={"center"}
        direction={"row"}
        gap={0.2}
        justifyContent={"center"}
      >
        <Checkbox
          inputProps={{ "aria-label": label }}
          title={label}
          disabled={!found}
          checked={active}
          onChange={onToggle}
        />
        <Box
          onClick={() => { setShowDialog(true); }}
          sx={{ cursor: "pointer" }}
        >
          <Typography
            sx={{ textDecorationLine: found ? undefined : "line-through", color: found ? undefined : "grey" }}
          >
            {`${index + 1}: ${category.keyword}`}
          </Typography>
        </Box>
      </Stack>
      <CategoryFilterDialog show={showDialog} onHide={() => { setShowDialog(false); }} category={category} />
    </Box>
  );
}
