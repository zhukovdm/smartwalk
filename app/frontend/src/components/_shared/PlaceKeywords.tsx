import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

type PlaceKeywordsProps = {

  /** Keywords attached to a place. */
  keywords: string[];
};

/**
 * List of place keywords shown in the Result or Viewer panel.
 */
export default function PlaceKeywords(
  { keywords }: PlaceKeywordsProps): JSX.Element {

  return (
    <Stack
      direction={"row"}
      flexWrap={"wrap"}
      justifyContent={"center"}
      gap={1}
      role={"list"}
      aria-label={"Keywords"}
    >
      {keywords.map((k, i) => (
        <Chip
          role={"listitem"}
          key={i}
          color={"primary"}
          label={k}
          sx={{ color: "black" }}
          variant={"outlined"}
        />
      ))}
    </Stack>
  );
}
