import { useState } from "react";
import {
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography
} from "@mui/material";
import {
  Delete,
  Directions,
  Edit,
  Info,
  MoreVert
} from "@mui/icons-material";

type ListItemMenuProps = {

  /** Redirect to the viewer. */
  onShow: () => void;

  /** Shows edit dialog. */
  showEditDialog: () => void;

  /** Shows delete dialog. */
  showDeleteDialog: () => void;

  /** Shows append dialog. */
  showAppendDialog?: () => void;

  /** Shows modify dialog. */
  showModifyDialog?: () => void;
};

/**
 * `Something`-specific menu in the storage list of `something`.
 */
export default function ListItemMenu(
  { onShow, showEditDialog, showDeleteDialog, showAppendDialog, showModifyDialog }: ListItemMenuProps): JSX.Element {

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const clickMenuAction = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const closeMenuAction = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton
        size={"small"}
        title={"Show menu"}
        onClick={clickMenuAction}
      >
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={closeMenuAction}
      >
        <MenuItem onClick={onShow}>
          <ListItemIcon>
            <Info fontSize={"small"} />
          </ListItemIcon>
          <Typography>View</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => { showEditDialog(); closeMenuAction(); }}
        >
          <ListItemIcon>
            <Edit fontSize={"small"} />
          </ListItemIcon>
          <Typography>Edit</Typography>
        </MenuItem>
        {!!showAppendDialog &&
          <MenuItem
            onClick={() => { showAppendDialog(); closeMenuAction(); }}
          >
            <ListItemIcon>
              <Directions fontSize={"small"} />
            </ListItemIcon>
            <Typography>Append</Typography>
          </MenuItem>
        }
        {!!showModifyDialog &&
          <MenuItem
            onClick={() => { showModifyDialog(); closeMenuAction(); }}
          >
            <ListItemIcon>
              <Directions fontSize={"small"} />
            </ListItemIcon>
            <Typography>Modify</Typography>
          </MenuItem>
        }
        <MenuItem
          onClick={() => { showDeleteDialog(); closeMenuAction(); }}
        >
          <ListItemIcon>
            <Delete fontSize={"small"} />
          </ListItemIcon>
          <Typography>Delete</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
