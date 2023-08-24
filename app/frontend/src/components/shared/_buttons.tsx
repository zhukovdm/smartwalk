import { MouseEventHandler, ReactElement } from "react";
import IconButton from "@mui/material/IconButton";
import {
  AddLocation,
  DeleteOutline,
  Directions,
  LocationOn,
  Route,
  SwapVert
} from "@mui/icons-material";
import { PlaceKind } from "./_types";

type IconWrapperProps = {
  disabled?: boolean;
  icon: ReactElement;
  title?: string;
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

  title?: string;

  onRoute: MouseEventHandler<Element>;
};

export function RouteButton({ title, onRoute }: RouteButtonProps): JSX.Element {
  return (
    <IconWrapper
      title={title}
      onClick={onRoute}
      icon={
        <Route
          fontSize={"medium"}
          className={"stored-route"}
        />
      }
    />
  );
}

type PlaceButtonProps = {

  /** Kind of a place presented to the user. */
  kind: PlaceKind;

  /** Concise description of an action. */
  title?: string;

  /** Button event handler. */
  onPlace: MouseEventHandler<Element>;
};

export function PlaceButton({ kind, title, onPlace }: PlaceButtonProps): JSX.Element {
  return (
    <IconWrapper
      onClick={onPlace}
      title={title}
      icon={
        <LocationOn
          fontSize={"medium"}
          className={`${kind}-place`}
        />
      }
    />
  );
}

type AddPlaceButtonProps = PlaceButtonProps & {

  disabled: boolean;
};

export function AddPlaceButton({ disabled, kind, title, onPlace }: AddPlaceButtonProps): JSX.Element {
  return (
    <IconWrapper
      disabled={disabled}
      icon={
        <AddLocation
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

  title?: string;

  onDirec: MouseEventHandler<Element>;
};

export function DirecButton({ title, onDirec }: DirecButtonProps): JSX.Element {
  return (
    <IconWrapper
      title={title}
      onClick={onDirec}
      icon={
        <Directions
          fontSize={"medium"}
          className={"stored-direc"}
        />
      }
    />
  );
}

type DeleteButtonProps = {
  title?: string;
  onDelete: MouseEventHandler<Element>;
};

export function DeleteButton({ title, onDelete }: DeleteButtonProps): JSX.Element {
  return (
    <IconWrapper
      title={title}
      onClick={onDelete}
      icon={<DeleteOutline className={"action-place"} />}
    />
  );
}

type SwapButtonProps = {
  title?: string;
  onSwap: MouseEventHandler<Element>;
};

export function SwapButton({ title, onSwap }: SwapButtonProps): JSX.Element {
  return (
    <IconWrapper
      title={title}
      onClick={onSwap}
      icon={<SwapVert color={"primary"} />}
    />
  );
}
