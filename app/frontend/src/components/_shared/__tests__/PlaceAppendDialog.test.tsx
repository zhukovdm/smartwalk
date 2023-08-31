import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import PlaceAppendDialog from "../PlaceAppendDialog";

const getDefault = () => ({
  show: true, onHide: jest.fn(), onAppend: jest.fn()
});

function render(props = getDefault()) {
  return rtlRender(<PlaceAppendDialog {...props} />);
}

describe("<PlaceAppendDialog />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("onHide gets called upon Escape", () => {
    const f = jest.fn();
    const { getByRole } = render({
      ...getDefault(),
      onHide: f
    });
    fireEvent.keyDown(getByRole("dialog"), { key: "Escape" });
    expect(f).toHaveBeenCalledTimes(1);
  });

  test("onHide gets called upon Cancel", () => {
    const f = jest.fn();
    const { getByRole } = render({
      ...getDefault(),
      onHide: f
    });
    fireEvent.click(getByRole("button", { name: "Cancel" }));
    expect(f).toHaveBeenCalledTimes(1);
  });

  test("onAppend and onHide get called upon Confirm", () => {
    const f0 = jest.fn();
    const f1 = jest.fn();
    const { getByRole } = render({
      ...getDefault(),
      onHide: f0,
      onAppend: f1
    });
    fireEvent.click(getByRole("button", { name: "Confirm" }));
    expect(f0).toHaveBeenCalledTimes(1);
    expect(f1).toHaveBeenCalledTimes(1);
  });
});
