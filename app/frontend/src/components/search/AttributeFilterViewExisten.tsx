import FormGroup from "@mui/material/FormGroup";
import type {
  AttributeFilterExisten,
  AttributeFilterExistenLabel
} from "../../domain/types";
import AttributeFilterCheckBox from "./AttributeFilterCheckBox";

export type AttributeFilterViewExistenProps = {

  /** Name of a filter */
  label: AttributeFilterExistenLabel;

  /** Current value */
  value: AttributeFilterExisten | undefined;

  /** Callback setting new value */
  setter: (v: AttributeFilterExisten | undefined) => void;
};

/**
 * Filter telling if an attribute exists on an entity.
 */
export default function AttributeFilterViewExisten(
  { label, value, setter }: AttributeFilterViewExistenProps): JSX.Element {

  const defined = value !== undefined;
  
  return (
    <FormGroup sx={{ display: "inline-block" }}>
      <AttributeFilterCheckBox
        checked={defined}
        label={label}
        onToggle={() => { setter(defined ? undefined : {}); }}
      />
    </FormGroup>
  );
}
