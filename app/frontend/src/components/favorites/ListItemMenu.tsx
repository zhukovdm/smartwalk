import { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import DirectionsIcon from "@mui/icons-material/Directions";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertIcon from "@mui/icons-material/MoreVert";

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
        <MoreVertIcon className={"action-place"} />
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
            <InfoIcon className={"action-place"} fontSize={"small"} />
          </ListItemIcon>
          <Typography>View</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => { showEditDialog(); closeMenuAction(); }}
        >
          <ListItemIcon>
            <EditIcon className={"action-place"} fontSize={"small"} />
          </ListItemIcon>
          <Typography>Edit</Typography>
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
        <MenuItem
          onClick={() => { showDeleteDialog(); closeMenuAction(); }}
        >
          <ListItemIcon>
            <DeleteIcon className={"action-place"} fontSize={"small"} />
          </ListItemIcon>
          <Typography>Delete</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
