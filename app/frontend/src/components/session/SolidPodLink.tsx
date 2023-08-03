import { Link } from "@mui/material";

/**
 * Standard link refering to the `Solid project / Get a pod`.
 */
export default function SolidPodLink(): JSX.Element {

  const url = "https://solidproject.org/users/get-a-pod";

  return (
    <Link
      href={url}
      title={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      Solid Pod
    </Link>
  );
}
