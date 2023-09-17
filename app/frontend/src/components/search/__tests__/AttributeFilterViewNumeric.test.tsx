import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import AttributeFilterViewNumeric, {
  type AttributeFilterViewNumericProps
} from "../AttributeFilterViewNumeric";

const getProps = (): AttributeFilterViewNumericProps => ({
  label: "minimumAge",
  bound: { min: 0, max: 100 },
  value: { min: 20, max: 80 },
  setter: jest.fn()
});

function render(props = getProps()) {
  return rtlRender(<AttributeFilterViewNumeric {...props} />);
}

describe("<AttributeFilterViewNumeric />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  it("should format camel case label properly", () => {
    const { getByText } = render();
    expect(getByText("minimum age between 20 and 80")).toBeInTheDocument();
  });

  it("should have active checkbox if value is defined", () => {
    const { getByRole } = render();
    expect(getByRole("checkbox")).toHaveProperty("checked", true);
  });

  it("should render two sliders for lower and upper bounds", () => {
    const { getByRole } = render();
    expect(getByRole("slider", { name: "Lower bound" })).toHaveValue("20");
    expect(getByRole("slider", { name: "Upper bound" })).toHaveValue("80");
  });

  it("should have inactive checkbox if value is not provided", () => {
    const { getByRole } = render({
      ...getProps(),
      value: undefined
    });
    expect(getByRole("checkbox", { name: "minimum age between 0 and 100" })).toHaveProperty("checked", false);
  });

  it("should attempt to set default value onToggle if not defined", () => {
    const setter = jest.fn();
    const { getByRole } = render({
      ...getProps(),
      value: undefined,
      setter: setter
    });
    fireEvent.click(getByRole("checkbox"));
    expect(setter).toHaveBeenCalledWith({ min: 0, max: 100 }); // default!
  });

  it("should attempt to unset value onToggle if defined", () => {
    const setter = jest.fn();
    const { getByRole } = render({
      ...getProps(),
      setter: setter
    });
    fireEvent.click(getByRole("checkbox"));
    expect(setter).toHaveBeenCalledWith(undefined);
  });

  it("should attempt to set new lower bound if slider position is changed", () => {
    const setter = jest.fn();
    const { getByRole } = render({
      ...getProps(),
      setter: setter
    });
    fireEvent.change(getByRole("slider", { name: "Lower bound" }), { target: { value: 30 } });
    expect(setter).toHaveBeenCalledWith({ min: 30, max: 80 });
  });

  it("should attempt to set new upper bound if slider position is changed", () => {
    const setter = jest.fn();
    const { getByRole } = render({
      ...getProps(),
      setter: setter
    });
    fireEvent.change(getByRole("slider", { name: "Upper bound" }), { target: { value: 70 } });
    expect(setter).toHaveBeenCalledWith({ min: 20, max: 70 });
  });
});
