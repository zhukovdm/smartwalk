import { Checkbox, FormControlLabel } from "@mui/material";
import { camelCaseToLabel } from "../../domain/functions";

type AttributeFilterCheckBoxProps = {

  /** Filter name */
  label: string;

  /** Action (un-)setting filter. */
  toggle: () => void;

  /** Checked indicator. */
  checked: boolean;
};

/**
 * Represent (un-)selected filters.
 */
export default function AttributeFilterCheckBox({ label, toggle, checked }: AttributeFilterCheckBoxProps): JSX.Element {
  return (
    <FormControlLabel
      label={camelCaseToLabel(label)}
      control={<Checkbox checked={checked} onChange={toggle} />}
    />
  );
}