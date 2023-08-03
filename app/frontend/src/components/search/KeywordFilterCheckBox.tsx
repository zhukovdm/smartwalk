import { Checkbox, FormControlLabel } from "@mui/material";
import { camelCaseToKeyword } from "../../domain/functions";

type KeywordFilterCheckBoxProps = {

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
export default function KeywordFilterCheckBox({ label, toggle, checked }: KeywordFilterCheckBoxProps): JSX.Element {
  return (
    <FormControlLabel
      label={camelCaseToKeyword(label)}
      control={<Checkbox checked={checked} onChange={toggle} />}
    />
  );
}
