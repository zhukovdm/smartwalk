import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Stack,
  SxProps,
  Typography
} from "@mui/material";
import { SomethingKind } from "../shared/types";

type FavouriteStubProps = {

  /** Location relative to the base URL */
  link: string;

  /** What is not found? */
  what: SomethingKind;

  /** Generate a styled icon shown to the user. */
  icon: (sx: SxProps) => ReactElement;
};

/**
 * Stub appearing in the storage section while loading data.
 */
export default function FavouriteStub({ link, what, icon }: FavouriteStubProps): JSX.Element {

  const navigate = useNavigate();

  return (
    <Stack gap={1} direction="column">
      <Box display="flex" justifyContent="center">
        <IconButton onClick={() => { navigate(link); }}>
          {icon({ fontSize: 50, color: "grey" })}
        </IconButton>
      </Box>
      <Box display="flex" justifyContent="center">
        <Typography fontSize="large" sx={{ fontWeight: "medium" }}>
          {`No ${what}s found`}
        </Typography>
      </Box>
    </Stack>
  );
}
