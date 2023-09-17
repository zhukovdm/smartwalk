import AddLocationIcon from "@mui/icons-material/AddLocation";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";

export type AddLocationButtonKind = "common" | "source" | "target" | "center";

export type AddLocationButtonProps = {

  /** Kind of a location to be added */
  kind: AddLocationButtonKind;

  /** Event handler */
  onClick: () => void;
};

/**
 * Button with `+`-like place icon with double-click prevention.
 */
export default function AddLocationButton(
  { kind, onClick }: AddLocationButtonProps): JSX.Element {

  // prevent double-click!
  const [disabled, setDisabled] = useState(false);

  const clickAction = () => {
    if (!disabled) {
      onClick();
      setDisabled(true);
    }
  }

  useEffect(() => {
    if (!disabled) { return; }
    const h = setTimeout(() => setDisabled(false), 500);
    return () => clearTimeout(h);
  }, [disabled]);

  return (
    <IconButton
      disabled={disabled}
      size={"small"}
      title={"Select location"}
      onClick={clickAction}
    >
      <AddLocationIcon
        fontSize={"large"}
        className={`${kind}-place`}
      />
    </IconButton>
  );
}
