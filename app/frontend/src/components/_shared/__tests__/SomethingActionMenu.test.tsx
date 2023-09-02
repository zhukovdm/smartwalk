import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import SomethingActionMenu, { SomethingActionMenuProps } from "../SomethingActionMenu";

const getDefault = (): SomethingActionMenuProps => ({
  showSaveDialog: jest.fn(),
  showAppendDialog: jest.fn(),
  showModifyDialog: jest.fn()
});

function render(props = getDefault()) {
  return rtlRender(<SomethingActionMenu {...props} />);
}

describe("<SomethingActionMenu />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("button", () => {
    const { getByRole } = render();
    expect(getByRole("button", { name: "Menu" })).toBeInTheDocument();
  });

  test("button controls menu", () => {
    const { getByRole, queryAllByRole } = render();
    expect(queryAllByRole("menu").length).toEqual(0);
    fireEvent.click(getByRole("button"));
    expect(getByRole("menu")).toBeInTheDocument();
  });

  test("Save gets called and hide menu", () => {
    const f = jest.fn();
    const { getByRole, queryAllByRole } = render({
      ...getDefault(),
      showSaveDialog: f
    });
    fireEvent.click(getByRole("button"));
    fireEvent.click(getByRole("menuitem", { name: "Save" }));
    expect(f).toHaveBeenCalledTimes(1);
    expect(queryAllByRole("menu").length).toEqual(0);
  });

  test("Save is disabled when no event handler", () => {
    const { getByRole } = render({});
    fireEvent.click(getByRole("button"));
    fireEvent.click(getByRole("menuitem", { name: "Save" }));
    expect(getByRole("menu")).toBeInTheDocument();
  });

  test("Append gets called and hide menu", () => {
    const f = jest.fn();
    const { getByRole, queryAllByRole } = render({
      ...getDefault(),
      showAppendDialog: f
    });
    fireEvent.click(getByRole("button"));
    fireEvent.click(getByRole("menuitem", { name: "Append" }));
    expect(f).toHaveBeenCalledTimes(1);
    expect(queryAllByRole("menu").length).toBe(0);
  });

  test("Modify gets called and hide menu", () => {
    const f = jest.fn();
    const { getByRole, queryAllByRole } = render({
      ...getDefault(),
      showModifyDialog: f
    });
    fireEvent.click(getByRole("button"));
    fireEvent.click(getByRole("menuitem", { name: "Modify" }));
    expect(f).toHaveBeenCalledTimes(1);
    expect(queryAllByRole("menu").length).toBe(0);
  });
});
