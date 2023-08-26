import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type ExpandSectionIconProps = {
  expanded: boolean;
};

export default function ExpandSectionIcon(
  { expanded }: ExpandSectionIconProps): JSX.Element {

  return (
    <ExpandMoreIcon titleAccess={expanded ? "Collapse" : "Expand"} />
  );
}
