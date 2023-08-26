import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type ExpandSectionIconProps = {

  /** Expanded/collapsed section */
  expanded: boolean;
};

/**
 * Icon with description for collapsible sections.
 */
export default function ExpandSectionIcon(
  { expanded }: ExpandSectionIconProps): JSX.Element {

  return (
    <ExpandMoreIcon titleAccess={expanded ? "Collapse" : "Expand"} />
  );
}
