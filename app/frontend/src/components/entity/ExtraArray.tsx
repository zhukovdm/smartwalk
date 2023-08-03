import { Stack, Typography } from "@mui/material";

type ExtraArrayProps = {

  /** Array of values associated with the label. */
  array: string[];

  label: "cuisine" | "clothes" | "rental";
};

/**
 * Components shows list of specific services under a specific category.
 */
export default function ExtraArray({ label, array }: ExtraArrayProps): JSX.Element {
  return (
    <Stack direction="row" gap={2}>
      <Typography>{label.slice(0, 1).toUpperCase() + label.slice(1)}:</Typography>
      <Typography>{array.join(", ")}</Typography>
    </Stack>
  );
}
