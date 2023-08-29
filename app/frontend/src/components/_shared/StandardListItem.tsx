import { ReactElement } from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type StandardListItemLabelProps = {

  /** Link to an external entity */
  link?: string;

  /** Label presented to the user */
  label: string;
};

/**
 * Standard list item label with centered content, and hidden overflow.
 */
export function StandardListItemLabel(
  { label, link }: StandardListItemLabelProps): JSX.Element {

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      sx={{
        borderBottom: "1px solid lightgray",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "100%",
      }}
    >
      <Typography noWrap>
        {(!link)
          ? label
          : <Link component={RouterLink} to={link} underline={"hover"}>{label}</Link>
        }
      </Typography>
    </Box>
  );
}

type StandardListItemProps = StandardListItemLabelProps & {

  /** An element appearing on the left */
  l: ReactElement;

  /** An element appearing on the right */
  r?: ReactElement;
};

/**
 * List item with left and right icons, and a label in-between.
 */
export default function StandardListItem(
  { l, r, ...rest }: StandardListItemProps): JSX.Element {

  return (
    <Stack
      aria-label={rest.label}
      direction={"row"}
      alignItems={"stretch"}
      role={"listitem"}
      gap={0.5}
      sx={{ width: "100%" }}
    >
      {l}
      <StandardListItemLabel {...rest} />
      {r}
    </Stack>
  );
}
