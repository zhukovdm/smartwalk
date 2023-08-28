import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { hidePanel } from "../../features/panelSlice";
import { useAppDispatch } from "../../features/storeHooks";

type LogoCloseBarProps = {

  /** Action upon clicking on a logo. */
  onLogo?: () => void;
};

/**
 * Upper bar with optional `logo` and mandatory `close` buttons.
 */
export default function LogoCloseBar({ onLogo: _ }: LogoCloseBarProps): JSX.Element {

  const dispatch = useAppDispatch();

  return (
    <Box
      display={"flex"}
      justifyContent={"right"}
      sx={{ mx: 2, my: 2 }}
    >
      <IconButton
        size={"small"}
        title={"Hide panel"}
        onClick={() => { dispatch(hidePanel()); }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
}
