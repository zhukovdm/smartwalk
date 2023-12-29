import { KeyboardEvent } from "react";
import Link from "@mui/material/Link";

export type ArrowsLinkButtonProps = {

  /** Event handler */
  onClick: () => void;
};

/**
 * Word `arrows` represented as a focusable button with attached action.
 */
export default function ArrowsLinkButton(
  { onClick }: ArrowsLinkButtonProps): JSX.Element {

  const keyboardAction = (e: KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      onClick();
    }
  }

  return (
    <Link
      aria-label={"arrows"}
      role={"button"}
      tabIndex={0}
      onKeyDown={keyboardAction}
      sx={{ cursor: "pointer" }}
      onClick={onClick}
      fontWeight={"medium"}
    >
      arrow-ordered
    </Link>
  );
}
