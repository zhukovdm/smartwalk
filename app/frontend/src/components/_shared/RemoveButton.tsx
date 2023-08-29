import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import { MouseEventHandler } from "react";

type RemoveButtonProps = {

  /** Button event handler */
  onClick: MouseEventHandler<Element>;
};

/**
 * Button with standard remove icon.
 */
export default function RemoveButton(props: RemoveButtonProps): JSX.Element {

  return (
    <IconButton {...props} size={"small"} title={"Remove point"}>
      <DeleteOutlineIcon className={"action-place"} />
    </IconButton>
  );
}
