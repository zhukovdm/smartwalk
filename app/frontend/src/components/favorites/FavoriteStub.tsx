import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Stack,
  SxProps,
  Typography
} from "@mui/material";
import { SomethingKind } from "../shared/_types";

type FavoriteStubProps = {

  /** What is not found? */
  what: SomethingKind;

  /** Generate a styled icon shown to the user. */
  icon: (sx: SxProps) => ReactElement;

  /** Location where items can be searched. */
  link: string;
};

/**
 * Stub appearing in the storage section in case no items are available.
 */
export default function FavoriteStub({ what, icon, link }: FavoriteStubProps): JSX.Element {

  const navigate = useNavigate();

  return (
    <Stack direction={"column"} gap={1}>
      <Box display={"flex"} justifyContent={"center"}>
        <IconButton
          title={`Search ${what}`}
          onClick={() => { navigate(link); }}
        >
          {icon({ fontSize: 50, color: "grey" })}
        </IconButton>
      </Box>
      <Box display={"flex"} justifyContent={"center"}>
        <Typography
          fontSize="large"
          sx={{ fontWeight: "medium" }}
        >
          {`No ${what}s found`}
        </Typography>
      </Box>
    </Stack>
  );
}
