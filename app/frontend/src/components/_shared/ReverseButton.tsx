import IconButton from "@mui/material/IconButton";
import SwapVertIcon from "@mui/icons-material/SwapVert";

export type ReverseButtonProps = {

  /** Button event handler */
  onClick: () => void;
};

/**
 * Reverse button with swap icon.
 */
export default function ReverseButton(props: ReverseButtonProps): JSX.Element {

  return (
    <IconButton {...props} size={"small"} title={"Reverse"}>
      <SwapVertIcon color={"primary"} />
    </IconButton>
  );
}
