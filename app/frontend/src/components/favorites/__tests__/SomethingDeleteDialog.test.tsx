import {
  fireEvent,
  render as rtlRender,
  waitFor
} from "@testing-library/react";
import { withState } from "../../../utils/testUtils";
import SomethingDeleteDialog, { type SomethingDeleteDialogProps } from "../SomethingDeleteDialog";

const getDefault = (): SomethingDeleteDialogProps => ({
  show: true,
  name: "Place A",
  what: "place",
  onHide: jest.fn(),
  onDelete: jest.fn()
});

function render(props = getDefault()) {
  return rtlRender(withState(<SomethingDeleteDialog {...props} />));
}

describe("<SomethingDeleteDialog />", () => {
  
  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("render name", () => {
    const { getByText } = render();
    expect(getByText(getDefault().name)).toBeInTheDocument();
  });

  test("Hide gets called upon Cancel", () => {
    const f = jest.fn();
    const { getByRole } = render({
      ...getDefault(),
      onHide: f
    });
    fireEvent.click(getByRole("button", { name: "Cancel" }));
    expect(f).toHaveBeenCalled();
  });

  test("Delete and Hide get called upon Delete", async () => {
    const d = jest.fn();
    const h = jest.fn();
    const { getByRole } = render({
      ...getDefault(),
      onHide: h,
      onDelete: d
    });
    fireEvent.click(getByRole("button", { name: "Delete" }));
    await waitFor(() => {
      [h, d].forEach((callback) => { expect(callback).toHaveBeenCalled(); });
    });
  });
});
