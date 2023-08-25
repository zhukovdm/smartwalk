import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import { AttributeFilterBoolean } from "../../domain/types";
import AttributeFilterCheckBox from "./AttributeFilterCheckBox";

type AttributeFilterViewBooleanProps = {

  /** Name of a filter. */
  label: string;

  /** Action setting new value. */
  setter: (v: AttributeFilterBoolean | undefined) => void;

  /** Initial value. */
  initial: AttributeFilterBoolean | undefined;
};

/**
 * Boolean-specific filter view.
 */
export default function AttributeFilterViewBoolean(
  { label, setter, initial }: AttributeFilterViewBooleanProps): JSX.Element {

  const flag = initial === undefined;

  const [check, setCheck] = useState(!flag);
  const [value, setValue] = useState((flag || !!initial) ? 1 : 0);

  const toggle = () => { setCheck(!check); };

  useEffect(() => { setter(check ? (!!value) : undefined) }, [check, value, setter]);

  return (
    <Stack
      direction={"row"}
      flexWrap={"wrap"}
      justifyContent={"space-between"}
    >
      <AttributeFilterCheckBox
        label={label}
        checked={check}
        toggle={toggle}
      />
      <FormControl>
        <RadioGroup
          row={true}
          value={value}
          onChange={(e) => { setValue(parseInt(e.target.value)); }}
        >
          <FormControlLabel
            disabled={!check}
            value={1}
            control={<Radio />}
            label={"Yes"}
          />
          <FormControlLabel
            disabled={!check}
            value={0}
            control={<Radio />}
            label={"No"}
          />
        </RadioGroup>
      </FormControl>
    </Stack>
  );
}
