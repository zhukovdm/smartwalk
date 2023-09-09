import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import ReverseButton, {
  type ReverseButtonProps
} from "../ReverseButton";

const getDefault = (): ReverseButtonProps => ({ onClick: jest.fn() });

function render(props = getDefault()) {
  return rtlRender(<ReverseButton {...props} />);
}

describe("<ReverseButton />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("title", () => {
    const { getByRole } = render();
    expect(getByRole("button", { name: "Reverse" })).toBeInTheDocument();
  });

  test("onClick gets called upon Click", () => {
    const f = jest.fn();
    const { getByRole } = render({
      ...getDefault(),
      onClick: f
    });
    fireEvent.click(getByRole("button"));
    expect(f).toHaveBeenCalledTimes(1);
  });
});
