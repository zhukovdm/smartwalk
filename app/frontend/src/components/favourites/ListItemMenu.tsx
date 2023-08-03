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
  Link,
  MoreVert
} from "@mui/icons-material";

type ListItemMenuProps = {

  /** Redirect to the something view. */
  onShow?: () => void;

  /** Shows update dialog. */
  showUpdateDialog: () => void;

  /** Shows delete dialog. */
  showDeleteDialog: () => void;
};

/**
 * `Something`-specific menu in the storage list of `something`.
 */
export default function ListItemMenu({ onShow, showDeleteDialog , showUpdateDialog }: ListItemMenuProps): JSX.Element {

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const clickMenuAction = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const closeMenuAction = () => { setAnchorEl(null); };

  return (
    <Box>
      <IconButton size="small" onClick={clickMenuAction}>
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={closeMenuAction}>
        {onShow &&
          <MenuItem onClick={onShow}>
            <ListItemIcon><Link fontSize="small" /></ListItemIcon>
            <Typography>Show</Typography>
          </MenuItem>
        }
        <MenuItem onClick={() => { showUpdateDialog(); closeMenuAction(); }}>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          <Typography>Edit</Typography>
        </MenuItem>
        <MenuItem onClick={() => { showDeleteDialog(); closeMenuAction(); }}>
          <ListItemIcon><Delete fontSize="small" /></ListItemIcon>
          <Typography>Delete</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
