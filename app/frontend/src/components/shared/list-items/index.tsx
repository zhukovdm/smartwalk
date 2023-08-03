import { ReactElement } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { PlaceKind } from "../types";
import { DeleteButton, PlaceButton } from "../buttons";

type ListItemLabelProps = {

  /** Label presented to the user. */
  label: string;
};

/**
 * Standard list item label with centered content, and hidden overflow.
 */
export function ListItemLabel({ label }: ListItemLabelProps): JSX.Element {
  return (
    <Box sx={{ width: "100%", display: "flex", alignItems: "center", borderBottom: "1px solid lightgray", overflow: "hidden", textOverflow: "ellipsis" }}>
      <Typography noWrap>{label}</Typography>
    </Box>
  );
}

type FreeListItemProps = {

  /** Label presented to the user. */
  label: string;

  /** Element appearing on the left. */
  l: ReactElement;
  
  /** Event handler upon clicking on an icon, or a label. */
  onClick: React.MouseEventHandler<Element>;
};

/**
 * List item that is supposed to be occupied upon click.
 */
function FreeListItem({ l, label, onClick }: FreeListItemProps): JSX.Element {
  return (
    <Stack direction="row" alignItems="stretch" gap={0.5} onClick={onClick} sx={{ cursor: "pointer", color: "gray" }}>
      {l}
      <ListItemLabel label={label} />
    </Stack>
  );
}

type BusyListItemProps = {

  /** Label presented to the user. */
  label: string;

  /** An element appearing on the left. */
  l: ReactElement;

  /** An element appearing on the right. */
  r: ReactElement;
};

export function BusyListItem({ label, l, r }: BusyListItemProps): JSX.Element {
  return (
    <Stack direction="row" alignItems="stretch" gap={0.5}>
      {l}
      <ListItemLabel label={label} />
      {r}
    </Stack>
  );
}

type PlaceListItemProps = {

  /** Kind of a pin presented to the user. */
  kind: PlaceKind;

  /** Label on the item presented to the user. */
  label: string;

  /** Action upon clicking on the icon. */
  onPlace: React.MouseEventHandler<Element>;
};

export function FreePlaceListItem({ kind, label, onPlace }: PlaceListItemProps): JSX.Element {
  return (<FreeListItem label={label} l={<PlaceButton kind={kind} onPlace={() => {}} />} onClick={onPlace} />);
}

export function SteadyPlaceListItem({ label, ...rest }: PlaceListItemProps): JSX.Element {
  return (<BusyListItem label={label} l={<PlaceButton {...rest} />} r={<></>} />);
}

type RemovablePlaceListItemProps = PlaceListItemProps & {
  onDelete: React.MouseEventHandler<Element>;
};

export function RemovablePlaceListItem({ label, onDelete, ...rest }: RemovablePlaceListItemProps): JSX.Element {
  return (<BusyListItem label={label} l={<PlaceButton {...rest} />} r={<DeleteButton onDelete={onDelete} />} />);
}
