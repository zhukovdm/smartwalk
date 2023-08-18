import { Search } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button } from "@mui/material";
import { useAppSelector } from "../../features/store";

type BottomButtonsProps = {

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
export default function BottomButtons({ disabled, onClear, onSearch }: BottomButtonsProps): JSX.Element {

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
      <LoadingButton
        size={"large"}
        variant={"contained"}
        startIcon={<Search />}
        loadingPosition={"start"}
        onClick={onSearch}
        loading={block}
        disabled={block || disabled}
      >
        <span>Search</span>
      </LoadingButton>
    </Box>
  );
}
