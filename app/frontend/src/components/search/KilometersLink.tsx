import Link from "@mui/material/Link";

/**
 * Link in Search panels stating unit, in which distances are measured.
 */
export default function KilometersLink(): JSX.Element {
  return (
    <Link
      href={"https://en.wikipedia.org/wiki/Kilometre"}
      title={"kilometers"}
    >
      km
    </Link>
  );
}
