import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import BackCloseBar from "./_shared/BackCloseBar";

/**
 * Panel shown for all unknown resources.
 */
export default function NotFoundPanel(): JSX.Element {

  return (
    <Box>
      <BackCloseBar />
      <Box sx={{ mx: 2, my: 4 }}>
        <Alert color="warning">Oops! Unknown address...</Alert>
      </Box>
    </Box>
  );
}
