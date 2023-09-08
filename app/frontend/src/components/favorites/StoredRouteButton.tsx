import RouteIcon from "@mui/icons-material/Route";
import IconButton from "@mui/material/IconButton";

export type StoredRouteButtonProps = {

  /** Draw event handler */
  onClick: () => void;
};

/**
 * Button with standard route icon.
 */
export default function StoredRouteButton(props: StoredRouteButtonProps): JSX.Element {

  return (
    <IconButton
      {...props}
      size={"small"}
      title={"Draw route"}
    >
      <RouteIcon className={"stored-share"} />
    </IconButton>
  );
}
