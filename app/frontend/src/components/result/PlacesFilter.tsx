import { useState } from "react";
import {
  Box,
  Checkbox,
  Stack,
  Typography
} from "@mui/material";
import { PlaceCondition } from "../../domain/types";
import PlaceConditionDialog from "./PlaceConditionDialog";

type PlacesFilterProps = {

  /** Flag is set if this condition is satisfied by some place */
  found: boolean;

  /** Indicate if the user has selected this filter */
  active: boolean;

  /** Indicate if the filter is disabled. */
  disabled: boolean;

  /** Condition that forms filter */
  condition: PlaceCondition;

  /** Toggle filter selection */
  onToggle: () => void;
};

/**
 * Filter based on actual conditions.
 */
export default function PlacesFilter({ found, active, disabled, condition, onToggle }: PlacesFilterProps): JSX.Element {

  const [condDialog, setCondDialog] = useState(false);

  return (
    <Box>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <Checkbox disabled={disabled || !found} checked={active} onChange={onToggle} />
        <Box onClick={() => { setCondDialog(true); }} sx={{ cursor: "pointer" }}>
          <Typography sx={{ textDecorationLine: found ? undefined : "line-through", color: found ? undefined : "grey" }}>
            {condition.keyword}
          </Typography>
        </Box>
      </Stack>
      {condDialog && <PlaceConditionDialog onHide={() => { setCondDialog(false); }} condition={condition} />}
    </Box>
  );
}
