import {
  act,
  fireEvent,
  render as rtlRender,
  waitFor
} from "@testing-library/react";
import { withState } from "../../../utils/testUtils";
import PlaceSaveDialog, {
  type PlaceSaveDialogProps
} from "../PlaceSaveDialog";

const getDefault = (): PlaceSaveDialogProps => ({
  name: "",
  show: true,
  onHide: jest.fn(),
  onSave: jest.fn()
});

function render(props = getDefault()) {
  return rtlRender(withState(<PlaceSaveDialog {...props} />));
}

describe("<PlaceSaveDialog />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("input changes", () => {
    const v = "Medieval Museum";
    const { getByRole } = render();
    fireEvent.change(getByRole("textbox"), { target: { value: v } });
    expect(getByRole("textbox", { name: "Name" })).toHaveValue(v);
  });

  test("Hide gets called upon Discard", () => {
    const f = jest.fn();
    const { getByRole } = render({
      ...getDefault(),
      onHide: f
    });
    fireEvent.click(getByRole("button", { name: "Discard" }));
    expect(f).toHaveBeenCalled();
  });

  test("Save is disabled if input is empty", () => {
    const f = jest.fn();
    const { getByRole } = render({
      ...getDefault(),
      onSave: f
    });
    fireEvent.click(getByRole("button", { name: "Save" }));
    expect(f).not.toHaveBeenCalled();
  });

  test("Save and Hide gets called upon Save", async () => {
    const h = jest.fn();
    const s = jest.fn();
    const { getByRole } = render({
      ...getDefault(),
      name: "A",
      onHide: h,
      onSave: s
    });
    act(() => {
      fireEvent.click(getByRole("button", { name: "Save" }));
    });
    await waitFor(() => {
      expect(h).toHaveBeenCalled();
      expect(s).toHaveBeenCalled();
    });
  });

  test("Hide is not called upon Escape", () => {
    const f = jest.fn();
    const { getByRole } = render({
      ...getDefault(),
      onHide: f
    });
    fireEvent.keyDown(getByRole("dialog"), { key: "Escape" });
    expect(f).not.toHaveBeenCalled();
  });
});
