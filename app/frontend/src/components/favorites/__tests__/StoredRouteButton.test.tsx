import { fireEvent, render as rtlRender } from "@testing-library/react";
import StoredRouteButton, { type StoredRouteButtonProps } from "../StoredRouteButton";

const getDefault = (): StoredRouteButtonProps => ({
  onClick: jest.fn()
});

function render(props = getDefault()) {
  return rtlRender(<StoredRouteButton {...props} />);
}

describe("<StoredRouteButton />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("button", () => {
    const { getByRole } = render();
    expect(getByRole("button", { name: "Draw route" })).toBeInTheDocument();
  });

  test("action gets called upon Click", () => {
    const c = jest.fn();
    const { getByRole } = render({
      ...getDefault,
      onClick: c
    });
    fireEvent.click(getByRole("button"));
    expect(c).toHaveBeenCalled();
  });
});
