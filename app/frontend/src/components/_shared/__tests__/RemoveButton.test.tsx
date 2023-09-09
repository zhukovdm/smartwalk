import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import RemoveButton, {
  type RemoveButtonProps
} from "../RemoveButton";

const getDefault = (): RemoveButtonProps => ({ onClick: jest.fn() });

function render(props = getDefault()) {
  return rtlRender(<RemoveButton {...props} />);
}

describe("<RemoveButton />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("title", () => {
    const { getByRole } = render();
    expect(getByRole("button", { name: "Remove point" })).toBeInTheDocument();
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
