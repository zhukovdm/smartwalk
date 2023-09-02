import DirectionsIcon from "@mui/icons-material/Directions";
import IconButton from "@mui/material/IconButton";

type StoredDirecButtonProps = {

  /** Button event handler */
  onClick: () => void;
};

/**
 * Button with standard directions icon.
 */
export default function StoredDirecButton(props: StoredDirecButtonProps): JSX.Element {

  return (
    <IconButton
      {...props}
      size={"small"}
      title={"Draw direction"}
    >
      <DirectionsIcon className={"stored-share"} />
    </IconButton>
  );
}
