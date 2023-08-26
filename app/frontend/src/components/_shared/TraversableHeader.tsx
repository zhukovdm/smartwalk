import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type TraversableHeaderProps = {

  /** Name of a route or direction (for stored entities) */
  name: string;
};

/**
 * Name of a route or direction shown in the Viewer panel.
 */
export default function TraversableHeader({ name }: TraversableHeaderProps): JSX.Element {
  return (
    <Stack gap={1}>
      <Typography
        fontSize={"1.25rem"}
        fontWeight={"medium"}
      >
        {name}
      </Typography>
      <Divider sx={{ background: "lightgrey" }} />
    </Stack>
  );
}
