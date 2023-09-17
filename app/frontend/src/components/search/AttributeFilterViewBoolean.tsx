import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import { AttributeFilterBoolean } from "../../domain/types";
import AttributeFilterCheckBox from "./AttributeFilterCheckBox";

export type AttributeFilterViewBooleanProps = {

  /** Name of a filter */
  label: string;

  /** Current value */
  value: AttributeFilterBoolean | undefined;

  /** Callback setting new value */
  setter: (v: AttributeFilterBoolean | undefined) => void;
};

/**
 * Boolean-specific filter view.
 */
export default function AttributeFilterViewBoolean(
  { label, value, setter }: AttributeFilterViewBooleanProps): JSX.Element {

  const defined = value !== undefined;

  return (
    <Stack
      direction={"row"}
      flexWrap={"wrap"}
      justifyContent={"space-between"}
    >
      <AttributeFilterCheckBox
        checked={defined}
        label={label}
        onToggle={() => { setter(defined ? undefined : true); }}
      />
      <FormControl>
        <RadioGroup
          row={true}
          value={defined ? (value ? "1" : "0") : "1"}
          onChange={(e) => { setter(e.target.value === "1"); }}
        >
          <FormControlLabel
            disabled={!defined}
            value={"1"}
            control={<Radio />}
            label={"Yes"}
          />
          <FormControlLabel
            disabled={!defined}
            value={"0"}
            control={<Radio />}
            label={"No"}
          />
        </RadioGroup>
      </FormControl>
    </Stack>
  );
}
