import { ReactElement } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Link, Stack, Typography } from "@mui/material";
import { getSmartPlaceLink } from "../../domain/functions";
import { PlaceKind } from "./_types";
import { DeleteButton, PlaceButton } from "./_buttons";

type ListItemLabelProps = {

  /** Link to an external entity. */
  link?: string;

  /** Label presented to the user. */
  label: string;
};

/**
 * Standard list item label with centered content, and hidden overflow.
 */
export function ListItemLabel({ label, link }: ListItemLabelProps): JSX.Element {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      sx={{
        width: "100%",
        borderBottom: "1px solid lightgray",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }}
    >
      <Typography noWrap>
        {(!link) ? label : <Link component={RouterLink} to={link} underline={"hover"}>{label}</Link>}
      </Typography>
    </Box>
  );
}

type FreeListItemProps = {

  /** Label presented to the user. */
  label: string;

  /** An element appearing on the left. */
  l: ReactElement;
  
  /** Event handler upon clicking on an icon, or a label. */
  onClick: React.MouseEventHandler<Element>;
};

/**
 * List item that is supposed to be occupied upon click.
 */
function FreeListItem({ l, label, onClick }: FreeListItemProps): JSX.Element {
  return (
    <Stack
      direction={"row"}
      alignItems={"stretch"}
      gap={0.5}
      onClick={onClick}
      sx={{ cursor: "pointer", color: "gray" }}
    >
      {l}
      <ListItemLabel label={label} />
    </Stack>
  );
}

type BusyListItemProps = {

  /** Label presented to the user. */
  label: string;

  /** Link to an external entity. */
  link?: string;

  /** An element appearing on the left. */
  l: ReactElement;

  /** An element appearing on the right. */
  r: ReactElement;
};

export function BusyListItem({ label, link, l, r }: BusyListItemProps): JSX.Element {
  return (
    <Stack
      direction={"row"}
      alignItems={"stretch"}
      gap={0.5}
    >
      {l}
      <ListItemLabel label={label} link={link} />
      {r}
    </Stack>
  );
}

type PlaceListItemProps = {

  /** Kind of a pin presented to the user. */
  kind: PlaceKind;

  /** Label on the item presented to the user. */
  label: string;

  /** Identificator known to the server. */
  smartId?: string;

  /** Concise action description. */
  title?: string;

  /** Action upon clicking on the icon. */
  onPlace: React.MouseEventHandler<Element>;
};

export function FreePlaceListItem({ kind, label, title, onPlace }: PlaceListItemProps): JSX.Element {
  return (
    <FreeListItem
      label={label}
      l={<PlaceButton kind={kind} onPlace={() => {}} title={title} />}
      onClick={onPlace}
    />
  );
}

export function FixedPlaceListItem({ label, smartId, ...rest }: PlaceListItemProps): JSX.Element {
  return (
    <BusyListItem
      label={label}
      link={getSmartPlaceLink(smartId)}
      l={<PlaceButton {...rest} />}
      r={<></>}
    />
  );
}

type RemovablePlaceListItemProps = PlaceListItemProps & {
  onDelete: React.MouseEventHandler<Element>;
};

export function RemovablePlaceListItem({ label, smartId, onDelete, ...rest }: RemovablePlaceListItemProps): JSX.Element {
  return (
    <BusyListItem
      label={label}
      link={getSmartPlaceLink(smartId)}
      l={<PlaceButton {...rest} />}
      r={<DeleteButton title={"Remove point"} onDelete={onDelete} />}
    />
  );
}
