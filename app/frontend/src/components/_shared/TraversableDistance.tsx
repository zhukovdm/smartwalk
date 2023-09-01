import Typography from "@mui/material/Typography";

export type TraversableDistanceProps = {

  /** Walking distance of a `traversable` */
  distance: number;
}

/**
 * Distance of a route or direction shown in the Result or Viewer panel.
 */
export default function TraversableDistance(
  { distance }: TraversableDistanceProps): JSX.Element {

  return (
    <Typography>
      Walking distance: <strong>{Number(distance.toFixed(2))}</strong> km
    </Typography>
  )
}
