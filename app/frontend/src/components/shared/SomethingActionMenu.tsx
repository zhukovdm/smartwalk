import { MouseEvent, useState } from "react";
import {
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography
} from "@mui/material";
import { Directions, Favorite, MoreVert } from "@mui/icons-material";

type ResultSomethingMenuProps = {

  showSaveDialog?: () => void;

  showAppendDialog?: () => void;

  showModifyDialog?: () => void;
};

export default function SomethingActionMenu(
  { showSaveDialog, showAppendDialog, showModifyDialog }: ResultSomethingMenuProps): JSX.Element {

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const clickMenuAction = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const closeMenuAction = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton
        aria-label={"Show menu"}
        color={"inherit"}
        onClick={clickMenuAction}
        size={"small"}
        title={"Show menu"}
      >
        <MoreVert fontSize={"small"} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        onClose={closeMenuAction}
        open={!!anchorEl}
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
            <Favorite className={"action-place"} fontSize={"small"} />
          </ListItemIcon>
          <Typography>Save</Typography>
        </MenuItem>
        {!!showAppendDialog &&
          <MenuItem
            onClick={() => { showAppendDialog(); closeMenuAction(); }}
          >
            <ListItemIcon>
              <Directions className={"action-place"} fontSize={"small"} />
            </ListItemIcon>
            <Typography>Append</Typography>
          </MenuItem>
        }
        {!!showModifyDialog &&
          <MenuItem
          onClick={() => { showModifyDialog(); closeMenuAction(); }}
        >
          <ListItemIcon>
            <Directions className={"action-place"} fontSize={"small"} />
          </ListItemIcon>
          <Typography>Modify</Typography>
        </MenuItem>
        }
      </Menu>
    </Box>
  );
}
