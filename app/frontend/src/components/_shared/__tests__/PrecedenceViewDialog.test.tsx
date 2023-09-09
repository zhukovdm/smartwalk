import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import { Network } from "vis-network";
import PrecedenceViewDialog, {
  type PrecedenceViewDialogProps
} from "../PrecedenceViewDialog";

jest.mock("vis-network", () => ({
  Network: jest.fn().mockImplementation(() => { })
}));

const getProps = (): PrecedenceViewDialogProps => ({
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

function render(props = getProps()) {
  return rtlRender(<PrecedenceViewDialog {...props} />);
}

describe("<PrecedenceViewDialog />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("render with empty arrays", () => {
    const { container } = render({
      ...getProps(),
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
        ...getProps(),
        precedence: []
      });
      expect(queryAllByRole("list").length).toEqual(0);
    });
  });

  describe("onHide", () => {

    test("gets called upon Escape", () => {
      const onHide = jest.fn();
      const { getByRole } = render({
        ...getProps(),
        onHide: onHide
      });
      fireEvent.keyDown(getByRole("dialog"), { key: "Escape" });
      expect(onHide).toHaveBeenCalledTimes(1);
    });

    test("gets called upon click on hide button", () => {
      const onHide = jest.fn();
      const { getByRole } = render({
        ...getProps(),
        onHide: onHide
      });
      fireEvent.click(getByRole("button", { name: "Hide dialog" }));
      expect(onHide).toHaveBeenCalledTimes(1);
    });
  });
});
