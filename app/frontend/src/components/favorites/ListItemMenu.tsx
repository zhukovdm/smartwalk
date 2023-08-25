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

  what: "place" | "route" | "direc"

  index: number;

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
  { what, index, onShow, showEditDialog, showDeleteDialog, showAppendDialog, showModifyDialog }: ListItemMenuProps): JSX.Element {

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);
  const bid = `favorites-my-${what}-menu-button-${index}`;
  const mid = `favorites-my-${what}-menu-${index}`;

  const clickMenuAction = (e: React.MouseEvent<HTMLElement>) => {
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
        size={"small"}
        title={"Menu"}
        aria-haspopup={"listbox"}
        aria-expanded={open}
        aria-controls={open ? mid : undefined}
      >
        <MoreVert className={"action-place"} />
      </IconButton>
      <Menu
        id={mid}
        aria-labelledby={bid}
        open={open}
        anchorEl={anchorEl}
        onClose={closeMenuAction}
      >
        <MenuItem onClick={onShow}>
          <ListItemIcon>
            <Info className={"action-place"} fontSize={"small"} />
          </ListItemIcon>
          <Typography>View</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => { showEditDialog(); closeMenuAction(); }}
        >
          <ListItemIcon>
            <Edit className={"action-place"} fontSize={"small"} />
          </ListItemIcon>
          <Typography>Edit</Typography>
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
        <MenuItem
          onClick={() => { showDeleteDialog(); closeMenuAction(); }}
        >
          <ListItemIcon>
            <Delete className={"action-place"} fontSize={"small"} />
          </ListItemIcon>
          <Typography>Delete</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
