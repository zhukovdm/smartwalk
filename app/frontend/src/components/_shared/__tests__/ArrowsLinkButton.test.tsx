import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import ArrowsLinkButton, { ArrowsLinkButtonProps } from "../ArrowsLinkButton";

const getDefault = (): ArrowsLinkButtonProps => ({
  onClick: jest.fn()
});

function render(props = getDefault()) {
  return rtlRender(<ArrowsLinkButton {...props} />);
}

describe("<ArrowsLinkButton />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("role and name", () => {
    const { getByRole } = render();
    expect(getByRole("button", { name: "arrows" })).toBeInTheDocument();
  });

  describe("onClick callback", () => {

    test("gets called upon Click", () => {
      const f = jest.fn();
      const { getByRole } = render({
        onClick: f
      });
      fireEvent.click(getByRole("button"));
      expect(f).toHaveBeenCalledTimes(1);
    });

    test("gets called upon Enter", () => {
      const f = jest.fn();
      const { getByRole } = render({
        onClick: f
      });
      fireEvent.keyDown(getByRole("button"), { key: "Enter" });
      expect(f).toHaveBeenCalledTimes(1);
    });

    test("gets called upon Space", () => {
      const f = jest.fn();
      const { getByRole } = render({
        onClick: f
      });
      fireEvent.keyDown(getByRole("button"), { key: " " });
      expect(f).toHaveBeenCalledTimes(1);
    });
  })
});
