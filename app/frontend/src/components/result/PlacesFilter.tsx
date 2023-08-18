import { useState } from "react";
import {
  Box,
  Checkbox,
  Stack,
  Typography
} from "@mui/material";
import { PlaceCategory } from "../../domain/types";
import PlaceCategoryDialog from "./PlaceCategoryDialog";

type PlacesFilterProps = {

  /** Flag is set if this condition is satisfied by some place */
  found: boolean;

  /** Indicate if the user has selected this filter */
  active: boolean;

  /** Indicate if the filter is disabled. */
  disabled: boolean;

  /** Category that forms a filter. */
  category: PlaceCategory;

  /** Toggle filter selection */
  onToggle: () => void;
};

/**
 * Filter based on actual conditions.
 */
export default function PlacesFilter(
  { found, active, disabled, category, onToggle }: PlacesFilterProps): JSX.Element {

  const [condDialog, setCondDialog] = useState(false);

  return (
    <Box>
      <Stack
        alignItems={"center"}
        direction={"row"}
        justifyContent={"center"}
      >
        <Checkbox
          checked={active}
          disabled={disabled || !found}
          onChange={onToggle}
        />
        <Box
          onClick={() => { setCondDialog(true); }}
          sx={{ cursor: "pointer" }}
        >
          <Typography sx={{ textDecorationLine: found ? undefined : "line-through", color: found ? undefined : "grey" }}>
            {category.keyword}
          </Typography>
        </Box>
      </Stack>
      {condDialog && <PlaceCategoryDialog onHide={() => { setCondDialog(false); }} category={category} />}
    </Box>
  );
}
