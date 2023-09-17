import {
  fireEvent,
  render as rtlRender,
  within
} from "@testing-library/react";
import AttributeFilterViewCollect, {
  type AttributeFilterViewCollectProps
} from "../AttributeFilterViewCollect";

const getProps = (): AttributeFilterViewCollectProps => ({
  label: "clothes",
  bound: ["a", "b", "c"],
  value: {
    inc: ["a"],
    exc: ["b"]
  },
  setter: jest.fn()
});

function render(props = getProps()) {
  return rtlRender(<AttributeFilterViewCollect {...props} />);
}

describe("<AttributeFilterViewCollect />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  it("should format camel case label properly", () => {
    const { getByText } = render();
    expect(getByText("clothes")).toBeInTheDocument();
  });

  it("should have active checkbox if value is defined", () => {
    const { getByRole } = render();
    expect(getByRole("checkbox")).toHaveProperty("checked", true);
  });

  it("should render `includes` and `excludes`", () => {
    const { getByRole } = render();
    ["Includes", "Excludes"].forEach((name) => {
      expect(getByRole("combobox", { name })).toBeInTheDocument();
    });
    ["a", "b"].forEach((name) => {
      expect(getByRole("button", { name })).toBeInTheDocument();
    });
  });

  it("should have inactive checkbox if value is not provided", () => {
    const { getByRole } = render({
      ...getProps(),
      value: undefined
    });
    expect(getByRole("checkbox", { name: "clothes" })).toHaveProperty("checked", false);
  });

  it("should attempt to set default value onToggle if not defined", () => {
    const setter = jest.fn();
    const { getByRole } = render({
      ...getProps(),
      value: undefined,
      setter: setter
    });
    fireEvent.click(getByRole("checkbox"));
    expect(setter).toHaveBeenCalledWith({ inc: [], exc: [] }); // default!
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

  it("should attempt to extend `includes` upon selection", () => {
    const setter = jest.fn();
    const { getByRole, getByText } = render({
      ...getProps(),
      setter: setter
    });
    fireEvent.click(within(getByRole("region", { name: "Includes" })).getByRole("button", { name: "Open" }));
    fireEvent.click(getByText("c"));
    expect(setter).toHaveBeenCalledWith({ inc: ["a", "c"], exc: ["b"] });
  });

  it("should attempt to extend `excludes` upon selection", () => {
    const setter = jest.fn();
    const { getByRole, getByText } = render({
      ...getProps(),
      setter: setter
    });
    fireEvent.click(within(getByRole("region", { name: "Excludes" })).getByRole("button", { name: "Open" }));
    fireEvent.click(getByText("c"));
    expect(setter).toHaveBeenCalledWith({ inc: ["a"], exc: ["b", "c"] });
  });
});
