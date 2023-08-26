import CircularProgress from "@mui/material/CircularProgress";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type LoadingStubWithLabelProps = {

  /** Percent of already loaded data. */
  progress: number;
};

/**
 * Loading stub with percent progress (e.g. storage loading).
 */
export default function LoadingStubWithLabel(
  { progress }: LoadingStubWithLabelProps): JSX.Element {

  return (
    <Stack
      direction={"row"}
      justifyContent={"center"}
      gap={2}
      alignItems={"center"}
    >
      <CircularProgress
        value={progress}
        variant={"determinate"}
      />
      <Typography>
        {`${progress}%`}
      </Typography>
    </Stack>
  );
}
