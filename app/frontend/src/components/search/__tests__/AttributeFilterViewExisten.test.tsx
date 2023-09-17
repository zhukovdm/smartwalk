import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import AttributeFilterViewExisten, {
  type AttributeFilterViewExistenProps
} from "../AttributeFilterViewExisten";

const getProps = (): AttributeFilterViewExistenProps => ({
  label: "socialNetworks",
  value: {},
  setter: jest.fn()
});

function render(props = getProps()) {
  return rtlRender(<AttributeFilterViewExisten {...props} />);
}

describe("<AttributeFilterViewExisten />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  it("should format camel case label properly", () => {
    const { getByText } = render();
    expect(getByText("social networks")).toBeInTheDocument();
  });

  it("should have active checkbox if value is defined", () => {
    const { getByRole } = render();
    expect(getByRole("checkbox", { name: "social networks" })).toHaveProperty("checked", true);
  });

  it("should have inactive checkbox if value is not provided", () => {
    const { getByRole } = render({
      ...getProps(),
      value: undefined
    });
    expect(getByRole("checkbox", { name: "social networks" })).toHaveProperty("checked", false);
  });

  it("should attempt to set default value onToggle if not defined", () => {
    const setter = jest.fn();
    const { getByRole } = render({
      ...getProps(),
      value: undefined,
      setter: setter
    });
    fireEvent.click(getByRole("checkbox", { name: "social networks" }));
    expect(setter).toHaveBeenCalledWith({});
  });

  it("should attempt to unset value onToggle if defined", () => {
    const setter = jest.fn();
    const { getByRole } = render({
      ...getProps(),
      setter: setter
    });
    fireEvent.click(getByRole("checkbox", { name: "social networks" }));
    expect(setter).toHaveBeenCalledWith(undefined);
  });
});
