import { render as rtlRender } from "@testing-library/react";
import ExpandSectionIcon from "../ExpandSectionIcon";

function render(expanded: boolean = true) {
  return rtlRender(<ExpandSectionIcon expanded={expanded} />);
}

describe("<ExpandSectionIcon />", () => {
  
  test("render", () => {
    const { getByRole } = render();
    expect(getByRole("img")).toBeInTheDocument();
  });

  test("expanded is collapsible", () => {
    const { getByRole } = render(true);
    expect(getByRole("img", { name: "Collapse" })).toBeInTheDocument();
  })

  test("collapsed is expandable", () => {
    const { getByRole } = render(false);
    expect(getByRole("img", { name: "Expand" })).toBeInTheDocument();
  })
});
