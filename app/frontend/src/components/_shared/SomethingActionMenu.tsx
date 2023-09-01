import { useState } from "react";
import type { MouseEvent } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import DirectionsIcon from "@mui/icons-material/Directions";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export type SomethingActionMenuProps = {

  /** Show save dialog */
  showSaveDialog?: () => void;

  /** Show/hide dialog for appending place. */
  showAppendDialog?: () => void;

  /** Show/hide dialog for modifying route or direction. */
  showModifyDialog?: () => void;
};

/**
 * Menu with allowed actions on a found entity (possible are save, append,
 * and modify).
 */
export default function SomethingActionMenu(
  { showSaveDialog, showAppendDialog, showModifyDialog }: SomethingActionMenuProps): JSX.Element {

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = !!anchorEl;
  const bid = `smartwalk-action-menu-button`;
  const mid = `smartwalk-action-menu`;

  const clickMenuAction = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const closeMenuAction = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton
        id={bid}
        onClick={clickMenuAction}
        color={"inherit"}
        size={"small"}
        title={"Menu"}
        aria-haspopup={"true"}
        aria-expanded={open}
        aria-controls={open ? mid : undefined}
      >
        <MoreVertIcon fontSize={"small"} />
      </IconButton>
      <Menu
        id={mid}
        aria-labelledby={bid}
        open={open}
        anchorEl={anchorEl}
        onClose={closeMenuAction}
      >
        <MenuItem
          disabled={!showSaveDialog}
          onClick={
            (!!showSaveDialog)
              ? () => { showSaveDialog(); closeMenuAction(); }
              : () => { }
          }
        >
          <ListItemIcon>
            <FavoriteIcon className={"action-place"} fontSize={"small"} />
          </ListItemIcon>
          <Typography>Save</Typography>
        </MenuItem>
        {!!showAppendDialog &&
          <MenuItem
            onClick={() => { showAppendDialog(); closeMenuAction(); }}
          >
            <ListItemIcon>
              <DirectionsIcon className={"action-place"} fontSize={"small"} />
            </ListItemIcon>
            <Typography>Append</Typography>
          </MenuItem>
        }
        {!!showModifyDialog &&
          <MenuItem
          onClick={() => { showModifyDialog(); closeMenuAction(); }}
        >
          <ListItemIcon>
            <DirectionsIcon className={"action-place"} fontSize={"small"} />
          </ListItemIcon>
          <Typography>Modify</Typography>
        </MenuItem>
        }
      </Menu>
    </Box>
  );
}
