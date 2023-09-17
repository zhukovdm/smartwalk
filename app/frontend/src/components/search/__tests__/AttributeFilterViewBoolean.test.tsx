import {
  fireEvent,  
  render as rtlRender
} from "@testing-library/react";
import AttributeFilterViewBoolean, {
  type AttributeFilterViewBooleanProps
} from "../AttributeFilterViewBoolean";

const getProps = (): AttributeFilterViewBooleanProps => ({
  label: "drinkingWater",
  value: true,
  setter: jest.fn()
});

function render(props = getProps()) {
  return rtlRender(<AttributeFilterViewBoolean {...props} />);
}

describe("<AttributeFilterViewBoolean />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  it("should format camel case label properly", () => {
    const { getByText } = render();
    expect(getByText("drinking water")).toBeInTheDocument();
  });

  it("should have active checkbox if value is defined", () => {
    const { getByRole } = render();
    expect(getByRole("checkbox", { name: "drinking water" })).toHaveProperty("checked", true);
  });

  it("renders selection options", () => {
    const { getByRole } = render();
    ["Yes", "No"].forEach((name) => {
      expect(getByRole("radio", { name })).toBeInTheDocument();
    });
  });

  it("should have inactive checkbox if value is not provided", () => {
    const { getByRole } = render({
      ...getProps(),
      value: undefined
    });
    expect(getByRole("checkbox", { name: "drinking water" })).toHaveProperty("checked", false);
  });

  it("should attempt to set default value onToggle if not defined", () => {
    const setter = jest.fn();
    const { getByRole } = render({
      ...getProps(),
      value: undefined,
      setter: setter
    });
    fireEvent.click(getByRole("checkbox", { name: "drinking water" }));
    expect(setter).toHaveBeenCalledWith(true); // default!
  });

  it("should attempt to unset value onToggle if defined", () => {
    const setter = jest.fn();
    const { getByRole } = render({
      ...getProps(),
      setter: setter
    });
    fireEvent.click(getByRole("checkbox", { name: "drinking water" }));
    expect(setter).toHaveBeenCalledWith(undefined);
  });

  it("should check Yes if value is undefined", () => {
    const { getByRole } = render({
      ...getProps(),
      value: undefined
    });
    expect(getByRole("radio", { name: "Yes" })).toHaveProperty("checked", true);
    expect(getByRole("radio", { name: "No" })).toHaveProperty("checked", false);
  });

  it("should check Yes if value is true", () => {
    const { getByRole } = render({
      ...getProps(),
      value: true
    });
    expect(getByRole("radio", { name: "Yes" })).toHaveProperty("checked", true);
    expect(getByRole("radio", { name: "No" })).toHaveProperty("checked", false);
  });

  it("should check No if value is false", () => {
    const { getByRole } = render({
      ...getProps(),
      value: false
    });
    expect(getByRole("radio", { name: "Yes" })).toHaveProperty("checked", false);
    expect(getByRole("radio", { name: "No" })).toHaveProperty("checked", true);
  });
});
