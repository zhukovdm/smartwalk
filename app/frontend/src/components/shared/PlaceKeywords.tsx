import { Chip, Stack } from "@mui/material";

type PlaceKeywordsProps = {
  keywords: string[];
};

export default function PlaceKeywords(
  { keywords }: PlaceKeywordsProps): JSX.Element {

  return (
    <Stack
      direction={"row"}
      flexWrap={"wrap"}
      justifyContent={"center"}
      gap={1}
    >
      {keywords.map((k, i) => (
        <Chip
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
