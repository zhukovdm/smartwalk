import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import { Network } from "vis-network";
import PrecedenceViewDialog, {
  PrecedenceViewDialogProps
} from "../PrecedenceViewDialog";

jest.mock("vis-network", () => ({
  Network: jest.fn().mockImplementation(() => { })
}));

const getDefault = (): PrecedenceViewDialogProps => ({
  show: true,
  categories: [
    { keyword: "castle", filters: {} },
    { keyword: "museum", filters: {} },
    { keyword: "statue", filters: {} }
  ],
  precedence: [
    { fr: 0, to: 1 },
    { fr: 1, to: 2 }
  ],
  onHide: jest.fn()
});

function render(props = getDefault()) {
  return rtlRender(<PrecedenceViewDialog {...props} />);
}

describe("<PrecedenceViewDialog />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("render with empty arrays", () => {
    const { container } = render({
      ...getDefault(),
      categories: [],
      precedence: []
    });
    expect(container).toBeTruthy();
  })

  describe("precedence list", () => {

    test("rendered", () => {
      const { getAllByRole } = render();
      expect(getAllByRole("listitem").length).toEqual(2);
    });

    test("not rendered if array is empty", () => {
      const { queryAllByRole } = render({
        ...getDefault(),
        precedence: []
      });
      expect(queryAllByRole("list").length).toEqual(0);
    });
  });

  describe("onHide", () => {

    test("gets called upon Escape", () => {
      const f = jest.fn();
      const { getByRole } = render({
        ...getDefault(),
        onHide: f
      });
      fireEvent.keyDown(getByRole("dialog"), { key: "Escape" });
      expect(f).toHaveBeenCalledTimes(1);
    });

    test("gets called upon click on hide button", () => {
      const f = jest.fn();
      const { getByRole } = render({
        ...getDefault(),
        onHide: f
      });
      fireEvent.click(getByRole("button", { name: "Hide dialog" }));
      expect(f).toHaveBeenCalledTimes(1);
    });
  });
});
