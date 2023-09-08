import {
  fireEvent,
  render as rtlRender,
  waitFor
} from "@testing-library/react";
import { withState } from "../../../utils/testUtils";
import SomethingEditDialog, { type SomethingEditDialogProps } from "../SomethingEditDialog";

const getDefault = (): SomethingEditDialogProps => ({
  name: "Place A",
  show: true,
  what: "place",
  onHide: jest.fn(),
  onSave: jest.fn()
});

function render(props = getDefault()) {
  return rtlRender(withState(<SomethingEditDialog {...props} />));
}

describe("<SomethingEditDialog />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("render dialog title", () => {
    const { getByText } = render();
    expect(getByText("Edit place")).toBeInTheDocument();
  });

  test("set new name", () => {
    const { getByRole } = render();
    fireEvent.change(getByRole("textbox", { name: "Name" }), { target: { value: "Place B" } });
    expect(getByRole("textbox", { name: "Name" })).toHaveValue("Place B");
  });

  it("should disable Save when name is an empty string", () => {
    const { getByRole } = render();
    const textBox = getByRole("textbox", { name: "Name" });
    fireEvent.change(textBox, { target: { value: "   \t   " } });
    expect(getByRole("button", { name: "Save" })).toHaveAttribute("disabled");
    fireEvent.change(textBox, { target: { value: "   Aa   " } });
    expect(getByRole("button", { name: "Save" })).not.toHaveAttribute("disabled");
  });

  test("Hide gets called and data items are reset upon Discard", () => {
    const h = jest.fn();
    const { getByRole } = render({
      ...getDefault(),
      onHide: h
    });
    const textBox = getByRole("textbox", { name: "Name" });
    fireEvent.change(textBox, { target: { value: "Place B" } });
    fireEvent.click(getByRole("button", { name: "Discard" }));
    expect(h).toHaveBeenCalled();
    expect(textBox).toHaveValue(getDefault().name);
  });

  test("Save and Hide get called upon Save", async () => {
    const h = jest.fn();
    const s = jest.fn();
    const { getByRole } = render({
      ...getDefault(),
      onHide: h,
      onSave: s
    });
    fireEvent.click(getByRole("button", { name: "Save" }));
    await waitFor(() => {
      [h, s].forEach((callback) => { expect(callback).toHaveBeenCalled(); });
    });
  });
});
