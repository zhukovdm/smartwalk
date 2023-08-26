import Typography from "@mui/material/Typography";

type TraversableDistanceProps = {

  /** Walking distance of a `traversable` */
  distance: number;
}

export default function TraversableDistance(
  { distance }: TraversableDistanceProps): JSX.Element {

  return (
    <Typography fontSize={"1.1rem"}>
      Distance:&nbsp;&nbsp;&nbsp;<strong>{Number(distance.toFixed(2))}</strong> km
    </Typography>
  )
}
