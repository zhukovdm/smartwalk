import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import PlaceButton, {
  type PlaceButtonProps
} from "../PlaceButton";

const getDefault = (): PlaceButtonProps => ({ kind: "common", title: "Fly to", onClick: jest.fn() });

function render(props = getDefault()) {
  return rtlRender(<PlaceButton {...props} />);
}

describe("<PlaceButton />", () => {
  
  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("title", () => {
    const { getByRole } = render();
    expect(getByRole("button", { name: "Fly to" })).toBeInTheDocument();
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
