import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

type DistanceSliderProps = {

  /** Upper bound. */
  max: number;

  /** Sequence of numbers presented to  */
  seq: number[];

  /** The distance between any two nearest points. */
  step: number;

  /** Actual value. */
  distance: number;

  /** Action setting new value. */
  dispatch: (value: number) => void;

  /** Slider label */
  ariaLabel: string;
};

/**
 * Standard distance slider used in Search panels.
 */
export default function DistanceSlider(
  { seq, distance, dispatch, ariaLabel, ...rest }: DistanceSliderProps): JSX.Element {

  const marks = seq.map(m => ({ value: m, label: m }));

  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Box sx={{ width: "94%" }}>
        <Slider
          {...rest}
          aria-label={ariaLabel}
          min={0}
          marks={marks}
          value={distance}
          valueLabelDisplay={"auto"}
          onChange={(_, value) => { dispatch(value as number); }}
        />
      </Box>
    </Box>
  );
}
