import { useContext } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { AppContext } from "../../App";
import { StorageKind } from "../../domain/interfaces";

/**
 * Alert saying what kind of storage (in-mem, local, or remote) is currently in use.
 */
export default function StorageSection(): JSX.Element {

  const { storage } = useContext(AppContext);

  return (
    <Box>
      {storage.kind() === StorageKind.InMem &&
        <Alert severity={"error"}>
          You use an <strong>in-memory</strong> storage. This might occur due to various reasons (old browser, private mode, etc.). Any data will be lost upon refreshing the page.
        </Alert>
      }
      {storage.kind() === StorageKind.Device &&
        <Alert severity={"info"}>
          Data is stored locally on your device.
        </Alert>
      }
      {storage.kind() === StorageKind.Solid &&
        <Alert severity={"success"}>
          Data is stored in your Solid Pod.
        </Alert>
      }
    </Box>
  );
}
