import SwapVertIcon from "@mui/icons-material/SwapVert";
import IconButton from "@mui/material/IconButton";
import { MouseEventHandler } from "react";

type ReverseButtonProps = {

  /** Button event handler */
  onClick: MouseEventHandler<Element>;
};

/**
 * Reverse button with standard swap icon.
 */
export default function ReverseButton(props: ReverseButtonProps): JSX.Element {

  return (
    <IconButton {...props} size={"small"} title={"Reverse"}>
      <SwapVertIcon color={"primary"} />
    </IconButton>
  );
}
