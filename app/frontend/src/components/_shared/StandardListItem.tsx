import type { ReactElement } from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export type StandardListItemProps = {

  /** Link to an external entity */
  link?: string;

  /** Label presented to the user */
  label: string;

  /** An element appearing on the left */
  l: ReactElement;

  /** An element appearing on the right */
  r?: ReactElement;
};

/**
 * List item with left and right icons, and a label in-between.
 */
export default function StandardListItem(
  { l, r, label, link }: StandardListItemProps): JSX.Element {

  return (
    <Stack
      direction={"row"}
      alignItems={"stretch"}
      gap={0.5}
      sx={{ width: "100%" }}
    >
      {l}
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
      {r}
    </Stack>
  );
}
