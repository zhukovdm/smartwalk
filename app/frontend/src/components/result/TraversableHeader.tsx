import {
  Divider,
  Stack,
  Typography
} from "@mui/material";

type TraversableHeaderProps = {
  name: string;
};

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
