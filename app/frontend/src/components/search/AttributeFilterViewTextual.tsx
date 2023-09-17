import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import type {
  AttributeFilterTextual,
  AttributeFilterTextualLabel
} from "../../domain/types";
import AttributeFilterCheckBox from "./AttributeFilterCheckBox";

export type AttributeFilterViewTextualProps = {

  /** Name of a filter */
  label: AttributeFilterTextualLabel;

  /** Current value */
  value: AttributeFilterTextual | undefined;

  /** Callback setting new value */
  setter: (v: AttributeFilterTextual | undefined) => void;
};

/**
 * Text-based filter view (substring matching).
 */
export default function AttributeFilterViewTextual(
  { label, setter, value }: AttributeFilterViewTextualProps) {

  const defined = value !== undefined;

  return (
    <Stack
      direction={"row"}
      columnGap={2}
    >
      <AttributeFilterCheckBox
        checked={defined}
        label={label}
        onToggle={() => { setter(defined ? undefined : ""); }}
      />
      <TextField
        disabled={!defined}
        fullWidth
        onChange={(e) => { setter(e.target.value); }}
        size={"small"}
        value={defined ? value : ""}
        label={"Text"}
      />
    </Stack>
  );
}
