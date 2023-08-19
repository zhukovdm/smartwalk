import { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Slider,
  Stack
} from "@mui/material";
import { AttributeFilterNumeric } from "../../domain/types";
import { camelCaseToLabel } from "../../domain/functions";
import { useAppSelector } from "../../features/storeHooks";

type AttributeFilterViewNumericProps = {

  /** Name of a filter. */
  label: string;

  /** Value setter. */
  setter: (v: AttributeFilterNumeric | undefined) => void;

  /** Initial value. */
  initial: AttributeFilterNumeric | undefined;
};

/**
 * Range-based numeric filter view.
 */
export default function AttributeFilterViewNumeric({ label, setter, initial }: AttributeFilterViewNumericProps): JSX.Element {

  const bound = (useAppSelector(state => state.panel.bounds) as any)[label] as AttributeFilterNumeric;

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
          sx={{ width: "94%" }}
          valueLabelDisplay={"auto"}
        />
      </Box>
    </Stack>
  );
}
