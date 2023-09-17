import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import type {
  AttributeFilterNumeric,
  AttributeFilterNumericLabel
} from "../../domain/types";
import AttributeFilterCheckBox from "./AttributeFilterCheckBox";

export type AttributeFilterViewNumericProps = {

  /** Name of a filter */
  label: AttributeFilterNumericLabel;

  /** Numeric lower and upper bounds */
  bound: AttributeFilterNumeric;

  /** Current value */
  value: AttributeFilterNumeric | undefined;

  /** Callback setting new value */
  setter: (v: AttributeFilterNumeric | undefined) => void;
};

/**
 * Range-based numeric filter view.
 */
export default function AttributeFilterViewNumeric(
  { label, bound, value, setter }: AttributeFilterViewNumericProps): JSX.Element {

  const defined = value !== undefined;

  const { min: curMin, max: curMax } = defined ? value : bound;

  return (
    <Stack rowGap={2}>
      <AttributeFilterCheckBox
        label={`${label} between ${curMin} and ${curMax}`}
        checked={defined}
        onToggle={() => { setter(defined ? undefined : bound); }}
      />
      <Box
        display={"flex"}
        justifyContent={"center"}
      >
        <Slider
          step={1}
          min={bound.min}
          max={bound.max}
          value={[curMin, curMax]}
          disabled={!defined}
          onChange={(_, v) => {
            const [min, max] = v as number[];
            setter({ min, max });
          }}
          getAriaLabel={(i) => `${i === 0 ? "Lower" : "Upper"} bound`}
          sx={{ width: "94%" }}
          valueLabelDisplay={"auto"}
        />
      </Box>
    </Stack>
  );
}
