import { render as rtlRender } from "@testing-library/react";
import TraversalHeader, {
  type TraversalHeaderProps
} from "../TraversalHeader";

const getDefault = (): TraversalHeaderProps => ({
  name: "Place A"
});

function render(props = getDefault()) {
  return rtlRender(<TraversalHeader {...props} />);
}

describe("<TraversalHeader />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("pass name", () => {
    const { getByText } = render();
    expect(getByText("Place A")).toBeInTheDocument();
  });
});
