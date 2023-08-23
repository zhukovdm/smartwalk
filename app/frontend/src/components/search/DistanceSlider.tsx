import { Box, Slider } from "@mui/material";

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
};

/**
 * Standard distance slider.
 */
export default function DistanceSlider({ seq, distance, dispatch, ...rest }: DistanceSliderProps): JSX.Element {
  const marks = seq.map(m => { return { value: m, label: m }; });

  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Box sx={{ width: "94%" }}>
        <Slider
          {...rest}
          aria-label={"Maximum walking distance"}
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
