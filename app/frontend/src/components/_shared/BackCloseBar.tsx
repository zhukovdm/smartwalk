import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { hidePanel } from "../../features/panelSlice";
import { useAppDispatch } from "../../features/storeHooks";

/**
 * Upper bar with optional `back` and mandatory `close` buttons.
 */
export default function BackCloseBar(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      sx={{ mx: 2, my: 2 }}
      alignItems={"center"}
    >
      <Box role={"none"}>
        <Button
          startIcon={<ArrowBackIcon />}
          size={"small"}
          onClick={() => { navigate(-1); }}
        >
          <span>Back</span>
        </Button>
      </Box>
      <IconButton
        size={"small"}
        title={"Hide panel"}
        onClick={() => { dispatch(hidePanel()); }}
      >
        <CloseIcon fontSize={"small"} />
      </IconButton>
    </Box>
  );
}
