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
  Edit,
  Info,
  MoreVert
} from "@mui/icons-material";

type ListItemMenuProps = {

  /** Redirect to the viewer. */
  onShow: () => void;

  /** Shows update dialog. */
  showUpdateDialog: () => void;

  /** Shows delete dialog. */
  showDeleteDialog: () => void;
};

/**
 * `Something`-specific menu in the storage list of `something`.
 */
export default function ListItemMenu(
  { onShow, showDeleteDialog, showUpdateDialog }: ListItemMenuProps): JSX.Element {

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
          onClick={() => { showUpdateDialog(); closeMenuAction(); }}
        >
          <ListItemIcon>
            <Edit fontSize={"small"} />
          </ListItemIcon>
          <Typography>Edit</Typography>
        </MenuItem>
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
