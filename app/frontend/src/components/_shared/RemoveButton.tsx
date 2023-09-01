import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export type RemoveButtonProps = {

  /** Button event handler */
  onClick: () => void;
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
