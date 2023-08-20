import { Link } from "@mui/material";

export function KilometersLink(): JSX.Element {
  return (
    <Link
      href={"https://en.wikipedia.org/wiki/Kilometre"}
      rel={"noopener noreferrer"}
      target={"_blank"}
      title={"kilometers"}
      underline={"hover"}
    >
      km
    </Link>
  );
}
