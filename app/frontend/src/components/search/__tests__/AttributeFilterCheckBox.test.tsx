import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import AttributeFilterCheckBox, {
  type AttributeFilterCheckBoxProps
} from "../AttributeFilterCheckBox";

const getProps = (): AttributeFilterCheckBoxProps => ({
  label: "website",
  onToggle: jest.fn(),
  checked: false
});

function render(props = getProps()) {
  return rtlRender(<AttributeFilterCheckBox {...props} />);
}

describe("<AttributeFilterCheckBox />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  it("should render label", () => {
    const { getByText } = render();
    expect(getByText("website")).toBeInTheDocument();
  });

  it("should be checked when checked", () => {
    const { getByRole } = render({
      ...getProps(),
      checked: true
    });
    expect(getByRole("checkbox", { name: "website" })).toHaveProperty("checked", true);
  });

  it("should trigger toggle upon click", () => {
    const onToggle = jest.fn();
    const { getByRole } = render({
      ...getProps(),
      onToggle: onToggle
    });
    fireEvent.click(getByRole("checkbox", { name: "website" }));
    expect(onToggle).toHaveBeenCalled();
  });
});
