import { useEffect, useState } from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack
} from "@mui/material";
import { KeywordFilterBoolean } from "../../domain/types";
import KeywordFilterCheckBox from "./KeywordFilterCheckBox";

type KeywordFilterViewBooleanProps = {

  /** Name of a filter. */
  label: string;

  /** Action setting new value. */
  setter: (v: KeywordFilterBoolean | undefined) => void;

  /** Initial value. */
  initial: KeywordFilterBoolean | undefined;
};

/**
 * Boolean-specific filter view.
 */
export default function KeywordFilterViewBoolean({ label, setter, initial }: KeywordFilterViewBooleanProps): JSX.Element {

  const flag = initial === undefined;

  const [check, setCheck] = useState(!flag);
  const [value, setValue] = useState((flag || !!initial) ? 1 : 0);

  const toggle = () => { setCheck(!check); };

  useEffect(() => { setter(check ? (!!value) : undefined) }, [check, value, setter]);

  return (
    <Stack direction="row" justifyContent="space-between" flexWrap="wrap">
      <KeywordFilterCheckBox label={label} checked={check} toggle={toggle} />
      <FormControl>
        <RadioGroup row value={value} onChange={(e) => { setValue(parseInt(e.target.value)); }}>
          <FormControlLabel disabled={!check} value={1} control={<Radio />} label="Yes" />
          <FormControlLabel disabled={!check} value={0} control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>
    </Stack>
  );
}
