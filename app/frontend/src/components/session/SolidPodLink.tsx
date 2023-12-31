import Link from "@mui/material/Link";

/**
 * Standard link referring to the `Solid project / Get a pod`.
 */
export default function SolidPodLink(): JSX.Element {

  const url = "https://solidproject.org/users/get-a-pod";

  return (
    <Link href={url} title={url}>
      Solid Pod
    </Link>
  );
}
