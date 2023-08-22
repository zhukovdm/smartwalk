import { ExpandMore } from "@mui/icons-material";

type ExpandSectionIconProps = {
  expanded: boolean;
};

export default function ExpandSectionIcon(
  { expanded }: ExpandSectionIconProps): JSX.Element {

  return (
    <ExpandMore titleAccess={expanded ? "Collapse" : "Expand"} />
  );
}
