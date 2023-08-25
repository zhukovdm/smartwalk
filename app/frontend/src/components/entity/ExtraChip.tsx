import Chip from "@mui/material/Chip";

type ExtraChipProps = {

  /** Label shown in the chip. */
  label: string;
};

/**
 * Chip smaller than keywor chip to show `extra` information.
 */
export default function ExtraChip(props: ExtraChipProps): JSX.Element {
  return (<Chip size={"small"} variant={"outlined"} {...props} />);
}
