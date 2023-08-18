import { Skeleton, Stack } from "@mui/material";

/**
 * Component showing stub while loading.
 */
export default function LoadStub(): JSX.Element {
  return (
    <Stack direction={"column"} gap={2}>
      <Skeleton variant={"rounded"} height={100} />
      <Skeleton variant={"rounded"} height={100} />
      <Skeleton variant={"rounded"} height={200} />
    </Stack>
  );
}
