import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PlaceKind } from "../../domain/types";
import PlaceButton from "./PlaceButton";

export type VacantPlaceListItemProps = {

  /** Kind of a place */
  kind: PlaceKind;

  /** Label presented to a user */
  label: string;

  /** Select `place` action */
  title: string;

  /** Button event handler */
  onClick: () => void;
};

export default function VacantPlaceListItem(
  { label, ...rest }: VacantPlaceListItemProps): JSX.Element {

  return (
    <Stack
      direction={"row"}
      alignItems={"stretch"}
      gap={0.5}
      sx={{ width: "100%" }}
    >
      <PlaceButton {...rest} />
      <Box
        display={"flex"}
        alignItems={"center"}
        sx={{
          borderBottom: "1px solid lightgray",
          color: "#595959",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
          cursor: "pointer"
        }}
        onClick={rest.onClick}
        aria-hidden
      >
        <Typography noWrap>{label}</Typography>
      </Box>
    </Stack>
  );
}
