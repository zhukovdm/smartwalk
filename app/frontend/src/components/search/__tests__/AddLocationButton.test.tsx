import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import AddLocationButton, {
  type AddLocationButtonProps
} from "../AddLocationButton";

const getProps = (): AddLocationButtonProps => ({
  kind: "source",
  onClick: jest.fn()
});

function render(props = getProps()) {
  return rtlRender(<AddLocationButton {...props} />);
}

describe("<AddLocationButton />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  describe("button", () => {

    it("callback gets called upon single click", () => {
      const callback = jest.fn();
      const { getByRole } = render({
        ...getProps(),
        onClick: callback
      });
      fireEvent.click(getByRole("button", { name: "Select location" }));
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("callback gets called only once upon N consecutive clicks", () => {
      const callback = jest.fn();
      const { getByRole } = render({
        ...getProps(),
        onClick: callback
      });
      const button = getByRole("button", { name: "Select location" });
      Array(5).fill(undefined).forEach(() => {
        fireEvent.click(button);
      });
      expect(callback).toHaveBeenCalledTimes(1);
      expect(button).toHaveAttribute("disabled");
    });
  });
});
