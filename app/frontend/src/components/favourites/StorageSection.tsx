import { useContext } from "react";
import { Alert, Box } from "@mui/material";
import { AppContext } from "../../App";

export default function StorageSection(): JSX.Element {

  const { storage } = useContext(AppContext);

  return (
    <Box>
      {storage.inmem() &&
        <Alert severity="error">
          You use an <strong>in-memory</strong> storage. This could happen due
          to several reasons (old browser, indexedDB is not supported, private
          mode, etc.). Data are not persisted.
        </Alert>
      }
      {storage.local() &&
        <Alert severity="info">
          Data are stored on your device. Log in to a&nbsp;remote storage, and
          make data available across multiple devices.
        </Alert>
      }
      {storage.remote() &&
        <Alert severity="success">
          You use a remote storage.
        </Alert>
      }
    </Box>
  );
}
