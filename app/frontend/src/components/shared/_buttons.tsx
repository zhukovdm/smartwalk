import { MouseEventHandler, ReactElement } from "react";
import IconButton from "@mui/material/IconButton";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DirectionsIcon from "@mui/icons-material/Directions";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RouteIcon from "@mui/icons-material/Route";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { PlaceKind } from "./_types";

type IconWrapperProps = {

  /** Disable component */
  disabled?: boolean;

  /** Icon show in the button */
  icon: ReactElement;

  /** Human-readable title */
  title?: string;

  /** Button callback */
  onClick?: MouseEventHandler<Element>;
};

function IconWrapper({ disabled, icon, title, onClick }: IconWrapperProps): JSX.Element {
  return (
    <IconButton
      disabled={disabled}
      title={title}
      size={"small"}
      onClick={onClick}
    >
      {icon}
    </IconButton>
  );
}

type RouteButtonProps = {

  /** Human-readable title */
  title?: string;

  /** Button callback */
  onRoute: MouseEventHandler<Element>;
};

export function RouteButton({ title, onRoute }: RouteButtonProps): JSX.Element {
  return (
    <IconWrapper
      title={title}
      onClick={onRoute}
      icon={
        <RouteIcon
          fontSize={"medium"}
          className={"stored-route"}
        />
      }
    />
  );
}

type PlaceButtonProps = {

  /** Kind of a place presented to the user */
  kind: PlaceKind;

  /** Concise description of an action */
  title?: string;

  /** Button callback */
  onPlace: MouseEventHandler<Element>;
};

export function PlaceButton({ kind, title, onPlace }: PlaceButtonProps): JSX.Element {
  return (
    <IconWrapper
      onClick={onPlace}
      title={title}
      icon={
        <LocationOnIcon
          fontSize={"medium"}
          className={`${kind}-place`}
        />
      }
    />
  );
}

type AddPlaceButtonProps = PlaceButtonProps & {

  /** Disable component. */
  disabled: boolean;
};

export function AddPlaceButton({ disabled, kind, title, onPlace }: AddPlaceButtonProps): JSX.Element {
  return (
    <IconWrapper
      disabled={disabled}
      icon={
        <AddLocationIcon
          fontSize={"large"}
          className={`${kind}-place`}
        />
      }
      title={title}
      onClick={onPlace}
    />
  );
}

type DirecButtonProps = {

  /** Human-readable title */
  title?: string;

  /** Button callback */
  onDirec: MouseEventHandler<Element>;
};

export function DirecButton({ title, onDirec }: DirecButtonProps): JSX.Element {
  return (
    <IconWrapper
      title={title}
      onClick={onDirec}
      icon={
        <DirectionsIcon
          fontSize={"medium"}
          className={"stored-direc"}
        />
      }
    />
  );
}

type DeleteButtonProps = {

  /** Human-readable title */
  title?: string;

  /** Button callback */
  onDelete: MouseEventHandler<Element>;
};

export function DeleteButton({ title, onDelete }: DeleteButtonProps): JSX.Element {
  return (
    <IconWrapper
      title={title}
      onClick={onDelete}
      icon={<DeleteOutlineIcon className={"action-place"} />}
    />
  );
}

type SwapButtonProps = {

  /** Human-readable title */
  title?: string;

  /** Button callback */
  onSwap: MouseEventHandler<Element>;
};

export function SwapButton({ title, onSwap }: SwapButtonProps): JSX.Element {
  return (
    <IconWrapper
      title={title}
      onClick={onSwap}
      icon={<SwapVertIcon color={"primary"} />}
    />
  );
}
