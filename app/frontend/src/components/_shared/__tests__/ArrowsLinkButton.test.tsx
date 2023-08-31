import {
  RenderResult,
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import ArrowsLinkButton from "../ArrowsLinkButton";

function render(
  onClick: () => void = () => { }
): RenderResult {
  return rtlRender(
    <ArrowsLinkButton onClick={onClick} />
  );
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
      const fn = jest.fn();
      const { getByRole } = render(fn);
      fireEvent.click(getByRole("button"));
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test("gets called upon Enter", () => {
      const fn = jest.fn();
      const { getByRole } = render(fn);
      fireEvent.keyDown(getByRole("button"), { key: "Enter" });
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test("gets called upon Space", () => {
      const fn = jest.fn();
      const { getByRole } = render(fn);
      fireEvent.keyDown(getByRole("button"), { key: " " });
      expect(fn).toHaveBeenCalledTimes(1);
    });
  })
});
