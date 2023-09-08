import { fireEvent, render as rtlRender } from "@testing-library/react";
import StoredDirecButton, { type StoredDirecButtonProps } from "../StoredDirecButton";

const getDefault = (): StoredDirecButtonProps => ({
  onClick: jest.fn()
});

function render(props = getDefault()) {
  return rtlRender(<StoredDirecButton {...props} />);
}

describe("<StoredDirecButton />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("button", () => {
    const { getByRole } = render();
    expect(getByRole("button", { name: "Draw direction" })).toBeInTheDocument();
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
