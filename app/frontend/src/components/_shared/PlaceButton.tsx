import LocationOnIcon from "@mui/icons-material/LocationOn";
import IconButton from "@mui/material/IconButton";
import { PlaceKind } from "../../domain/types";

type PlaceButtonProps = {

  /** Kind of a place presented to the user */
  kind: PlaceKind;

  /** Concise description of an action */
  title: string;

  /** Button callback */
  onClick: ()  => void;
};

/**
 * Button with standard place icon.
 */
export default function PlaceButton({ kind, ...rest }: PlaceButtonProps): JSX.Element {

  return (
    <IconButton {...rest} size={"small"}>
      <LocationOnIcon className={`${kind}-place`} />
    </IconButton>
  );
}
