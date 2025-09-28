import Typography from "@mui/material/Typography";

export type TraversalDistanceProps = {

  /** Walking distance of a `traversable` */
  distance: number;

  /** Indicator when an input path distance exceeds maximum allowed. */
  exceedsMaxDistance: boolean;
}

/**
 * Distance of a route or direction shown in the Result or Viewer panel.
 */
export default function TraversalDistance({ distance, exceedsMaxDistance }: TraversalDistanceProps): JSX.Element {
  const className = !exceedsMaxDistance
    ? "source-place"
    : "target-place";

  return (
    <Typography>
      Walking distance: <strong className={className}>{parseFloat(distance.toFixed(2))}</strong>&nbsp;km
    </Typography>
  )
}
