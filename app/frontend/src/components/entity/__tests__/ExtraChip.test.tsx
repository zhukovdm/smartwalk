import { render as rtlRender } from "@testing-library/react";
import ExtraChip, { type ExtraChipProps } from "../ExtraChip";

const getDefault = (): ExtraChipProps => ({
  label: "medieval museum"
});

function render(props = getDefault()) {
  return rtlRender(<ExtraChip {...props} />);
}

describe("<ExtraChip />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("chip contains label", () => {
    const { getByText } = render();
    expect(getByText(getDefault().label)).toBeInTheDocument();
  });
})
