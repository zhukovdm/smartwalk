import Chip from "@mui/material/Chip";

export type ExtraChipProps = {

  /** Label shown in the chip. */
  label: string;
};

/**
 * Chip smaller than keyword chip to show `extra` information.
 */
export default function ExtraChip(props: ExtraChipProps): JSX.Element {
  return (<Chip size={"small"} variant={"outlined"} {...props} />);
}
