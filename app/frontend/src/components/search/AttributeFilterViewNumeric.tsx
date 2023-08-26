import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import { camelCaseToLabel } from "../../domain/functions";
import { AttributeFilterNumeric } from "../../domain/types";

type AttributeFilterViewNumericProps = {

  /** Name of a filter. */
  label: string;

  /** Numeric lower and upper bounds */
  bound: AttributeFilterNumeric;

  /** Value setter. */
  setter: (v: AttributeFilterNumeric | undefined) => void;

  /** Initial value. */
  initial: AttributeFilterNumeric | undefined;
};

/**
 * Range-based numeric filter view.
 */
export default function AttributeFilterViewNumeric(
  { label, bound, setter, initial }: AttributeFilterViewNumericProps): JSX.Element {

  const [check, setCheck] = useState(!!initial);
  const [value, setValue] = useState(initial ? [initial.min, initial.max] : [bound.min, bound.max]);

  const toggle = () => { setCheck(!check); };

  const change = (_: Event, v: number | number[]) => { setValue(v as number[]); };

  useEffect(() => {
    setter(check ? { min: value[0], max: value[1] } : undefined);
  }, [check, value, setter]);

  return (
    <Stack spacing={3}>
      <FormControlLabel
        control={<Checkbox checked={check} onChange={toggle} />}
        label={`${camelCaseToLabel(label)} between ${value[0]} and ${value[1]}`}
      />
      <Box display={"flex"} justifyContent={"center"}>
        <Slider
          step={1}
          min={bound.min}
          max={bound.max}
          value={value}
          disabled={!check}
          onChange={change}
          getAriaLabel={(i) => `${i === 0 ? "Lower" : "Upper"} bound`}
          sx={{ width: "94%" }}
          valueLabelDisplay={"auto"}
        />
      </Box>
    </Stack>
  );
}
