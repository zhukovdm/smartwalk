import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import { useAppSelector } from "../../features/storeHooks";

export type BottomButtonsProps = {

  /** Flag disabling `search` button. */
  disabled: boolean;

  /** Action clearing search form. */
  onClear: () => void;

  /** Action initiating search routine. */
  onSearch: () => void;
};

/**
 * Standard `clear` and `search` bottom buttons.
 */
export default function BottomButtons(
  { disabled, onClear, onSearch }: BottomButtonsProps): JSX.Element {

  const { block } = useAppSelector((state) => state.panel);

  return (
    <Box display={"flex"} justifyContent={"space-evenly"}>
      <Button
        color={"error"}
        disabled={block}
        onClick={onClear}
      >
        <span>Clear</span>
      </Button>
      <Button
        loading={block}
        loadingPosition={"start"}
        size={"large"}
        startIcon={<SearchIcon />}
        variant={"contained"}
        onClick={onSearch}
        disabled={block || disabled}
      >
        <span>Search</span>
      </Button>
    </Box>
  );
}
