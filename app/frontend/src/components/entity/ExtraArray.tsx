import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export type ExtraArrayLabel = "clothes" | "cuisine" | "denomination" | "payment" | "rental";

export type ExtraArrayProps = {

  /** Array of values associated with the label */
  array: string[];

  /** Label for a array name */
  label: ExtraArrayLabel;
};

/**
 * Components shows list of specific services under a specific category.
 */
export default function ExtraArray({ label, array }: ExtraArrayProps): JSX.Element {
  return (
    <Stack direction={"row"} gap={2}>
      <Typography>{label.slice(0, 1).toUpperCase() + label.slice(1)}:</Typography>
      <Typography
        aria-label={label}
      >
        {array.join(", ")}
      </Typography>
    </Stack>
  );
}
