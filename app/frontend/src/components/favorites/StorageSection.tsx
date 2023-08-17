import { useContext } from "react";
import { Alert, Box } from "@mui/material";
import { AppContext } from "../../App";

export default function StorageSection(): JSX.Element {

  const { storage } = useContext(AppContext);

  return (
    <Box>
      {storage.mem() &&
        <Alert severity="error">
          You use an <strong>in-memory</strong> storage. This might occur due
          to various reasons (old browser, private mode, etc.). Any data will
          be lost upon refreshing the page.
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
