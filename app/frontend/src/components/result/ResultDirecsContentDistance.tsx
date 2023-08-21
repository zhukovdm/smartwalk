import { Typography } from "@mui/material";

type ResultDirecsContentDistanceProps = {
  distance: number;
}

export default function ResultDirecsContentDistance(
  { distance }: ResultDirecsContentDistanceProps): JSX.Element {

  return (
    <Typography fontSize={"1.1rem"}>
      Distance:&nbsp;&nbsp;&nbsp;<strong>{Number(distance.toFixed(2))}</strong> km
    </Typography>
  )
}
