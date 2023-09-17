import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import AttributeFilterViewTextual, {
  type AttributeFilterViewTextualProps
} from "../AttributeFilterViewTextual";

const getProps = (): AttributeFilterViewTextualProps => ({
  label: "name",
  value: "Abc",
  setter: jest.fn()
});

function render(props = getProps()) {
  return rtlRender(<AttributeFilterViewTextual {...props} />);
}

describe("<AttributeFilterViewTextual />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  it("should format camel case label properly", () => {
    const { getByText } = render();
    expect(getByText("name")).toBeInTheDocument();
  });

  it("should have active checkbox if value is defined", () => {
    const { getByRole } = render();
    expect(getByRole("checkbox", { name: "name" })).toHaveProperty("checked", true);
  });

  it("should render textbox", () => {
    const { getByRole } = render();
    expect(getByRole("textbox", { name: "Text" })).toBeInTheDocument();
  });

  it("should have inactive checkbox if value is not provided", () => {
    const { getByRole } = render({
      ...getProps(),
      value: undefined
    });
    expect(getByRole("checkbox", { name: "name" })).toHaveProperty("checked", false);
  });

  it("should attempt to set default value onToggle if not defined", () => {
    const setter = jest.fn();
    const { getByRole } = render({
      ...getProps(),
      value: undefined,
      setter: setter
    });
    fireEvent.click(getByRole("checkbox", { name: "name" }));
    expect(setter).toHaveBeenCalledWith(""); // default!
  });

  it("should attempt to unset value onToggle if defined", () => {
    const setter = jest.fn();
    const { getByRole } = render({
      ...getProps(),
      setter: setter
    });
    fireEvent.click(getByRole("checkbox", { name: "name" }));
    expect(setter).toHaveBeenCalledWith(undefined);
  });

  it("should set textbox if value is provided", () => {
    const { getByRole } = render();
    expect(getByRole("textbox", { name: "Text" })).toHaveValue("Abc");
  });

  it("should attempt to set new value on change", () => {
    const setter = jest.fn();
    const { getByRole } = render({
      ...getProps(),
      setter: setter
    });
    fireEvent.change(getByRole("textbox"), { target: { value: "Abcd" } });
    expect(setter).toHaveBeenCalledWith("Abcd");
  });
});
