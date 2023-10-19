import { useContext } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { AppContext } from "../../App";

/**
 * Alert saying what kind of storage (in-mem, local, or remote) is currently in use.
 */
export default function StorageSection(): JSX.Element {

  const { storage } = useContext(AppContext);

  return (
    <Box>
      {storage.inmemory() &&
        <Alert severity={"error"}>
          You use an <strong>in-memory</strong> storage. This might occur due to various reasons (old browser, private mode, etc.). Any data will be lost upon refreshing the page.
        </Alert>
      }
      {storage.device() &&
        <Alert severity={"info"}>
          Data are stored locally on your device.
        </Alert>
      }
      {storage.decentralized() &&
        <Alert severity={"success"}>
          You use a decentralized storage.
        </Alert>
      }
    </Box>
  );
}
