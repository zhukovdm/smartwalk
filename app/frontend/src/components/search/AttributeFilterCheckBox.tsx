import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { camelCaseToLabel } from "../../utils/functions";

export type AttributeFilterCheckBoxProps = {

  /** Filter name */
  label: string;

  /** Action (un-)setting filter. */
  onToggle: () => void;

  /** Checked indicator. */
  checked: boolean;
};

/**
 * Represent (un-)selected filter.
 */
export default function AttributeFilterCheckBox(
  { label, onToggle, checked }: AttributeFilterCheckBoxProps): JSX.Element {

  return (
    <FormControlLabel
      label={camelCaseToLabel(label)}
      control={<Checkbox checked={checked} onChange={onToggle} />}
    />
  );
}
