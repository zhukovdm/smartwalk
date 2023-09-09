import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import ListItemMenu, {
  type ListItemMenuProps
} from "../ListItemMenu";

const getDefault = (): ListItemMenuProps => ({
  what: "place",
  index: 0,
  onShow: jest.fn(),
  showEditDialog: jest.fn(),
  showDeleteDialog: jest.fn(),
  showAppendDialog: jest.fn(),
  showModifyDialog: jest.fn()
});

function render(props = getDefault()) {
  return rtlRender(<ListItemMenu {...props} />);
}

describe("<ListItemMenu />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("button", () => {
    const { getByRole } = render();
    expect(getByRole("button", { name: "Menu" })).toBeInTheDocument();
  });

  test("button controls menu", () => {
    const { getByRole } = render();
    fireEvent.click(getByRole("button", { name: "Menu" }));
    expect(getByRole("menu")).toBeInTheDocument();
  });

  test("Show gets called and menu remains shown", () => {
    const f = jest.fn();
    const { getByRole } = render({
      ...getDefault(),
      onShow: f
    });
    fireEvent.click(getByRole("button"));
    fireEvent.click(getByRole("menuitem", { name: "View" }));
    expect(f).toHaveBeenCalledTimes(1);
    expect(getByRole("menu")).toBeInTheDocument();
  });

  test("Edit gets called and menu hides", () => {
    const f = jest.fn();
    const { getByRole, queryAllByRole } = render({
      ...getDefault(),
      showEditDialog: f
    });
    fireEvent.click(getByRole("button"));
    fireEvent.click(getByRole("menuitem", { name: "Edit" }));
    expect(f).toHaveBeenCalledTimes(1);
    expect(queryAllByRole("menu").length).toBe(0);
  });

  test("Delete gets called and menu hides", () => {
    const f = jest.fn();
    const { getByRole, queryAllByRole } = render({
      ...getDefault(),
      showDeleteDialog: f
    });
    fireEvent.click(getByRole("button"));
    fireEvent.click(getByRole("menuitem", { name: "Delete" }));
    expect(f).toHaveBeenCalledTimes(1);
    expect(queryAllByRole("menu").length).toBe(0);
  });

  test("Append gets called and menu hides", () => {
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

  test("Append not rendered if callback is missing", () => {
    const { getByRole, queryAllByText } = render({
      ...getDefault(),
      showAppendDialog: undefined
    });
    fireEvent.click(getByRole("button"));
    expect(queryAllByText("Append").length).toBe(0);
  });

  test("Modify gets called and menu hides", () => {
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

  test("Modify not rendered if callback is missing", () => {
    const { getByRole, queryAllByText } = render({
      ...getDefault(),
      showModifyDialog: undefined
    });
    fireEvent.click(getByRole("button"));
    expect(queryAllByText("Modify").length).toBe(0);
  });
});
