import {
    render as rtlRender
} from "@testing-library/react";
import KilometersLink from "../KilometersLink";

function render() {
  return rtlRender(<KilometersLink />);
}

describe("<KilometersLink />", () => {
  
  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  it("should render link", () => {
    const { getByRole } = render();
    expect(getByRole("link", { name: "km" })).toBeInTheDocument();
  });
})
