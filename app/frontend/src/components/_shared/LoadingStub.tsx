import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

/**
 * Component showing stub while loading.
 */
export default function LoadingStub(): JSX.Element {
  return (
    <Box display={"flex"} justifyContent={"center"}>
      <CircularProgress />
    </Box>
  );
}
