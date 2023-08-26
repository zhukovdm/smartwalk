import { useContext } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { AppContext } from "../../App";

/**
 * Bar saying what kind of storage (in-memory, local, or remote) is currently
 * used.
 */
export default function StorageSection(): JSX.Element {

  const { storage } = useContext(AppContext);

  return (
    <Box>
      {storage.mem() &&
        <Alert severity="error">
          You use an <strong>in-memory</strong> storage. This might occur due to various reasons (old browser, private mode, etc.). Any data will be lost upon refreshing the page.
        </Alert>
      }
      {storage.loc() &&
        <Alert severity="info">
          Data are stored locally on your device.
        </Alert>
      }
      {storage.rem() &&
        <Alert severity="success">
          You use a remote storage.
        </Alert>
      }
    </Box>
  );
}
