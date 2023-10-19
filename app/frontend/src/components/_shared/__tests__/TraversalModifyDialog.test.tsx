import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import TraversalModifyDialog, {
  type TraversalModifyDialogProps
} from "../TraversalModifyDialog";

const getDefault = (): TraversalModifyDialogProps => ({
  show: true,
  what: "route",
  onHide: jest.fn(),
  onModify: jest.fn()
});

function render(props = getDefault()) {
  return rtlRender(<TraversalModifyDialog {...props} />);
}

describe("<TraversalModifyDialog />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("Hide gets called upon discard", () => {
    const f = jest.fn();
    const { getByRole } = render({
      ...getDefault(),
      onHide: f
    });
    fireEvent.click(getByRole("button", { name: "Cancel" }));
    expect(f).toHaveBeenCalled();
  });

  test("Hide gets called upon Escape", () => {
    const f = jest.fn();
    const { getByRole } = render({
      ...getDefault(),
      onHide: f
    });
    fireEvent.keyDown(getByRole("dialog"), { key: "Escape" });
    expect(f).toHaveBeenCalled();
  });

  test("Modify and Hide gets called upon Confirm", async () => {
    const h = jest.fn();
    const m = jest.fn();
    const { getByRole } = render({
      ...getDefault(),
      onHide: h,
      onModify: m
    });
    fireEvent.click(getByRole("button", { name: "Confirm" }));
    expect(h).toHaveBeenCalled();
    expect(m).toHaveBeenCalled();
  });
});
