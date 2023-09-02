import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import VacantPlaceListItem, { VacantPlaceListItemProps } from "../VacantPlaceListItem";

const getDefault = (): VacantPlaceListItemProps => ({
  kind: "action",
  label: "Place A",
  title: "Fly to",
  onClick: jest.fn()
});

function render(props = getDefault()) {
  return rtlRender(<VacantPlaceListItem {...props} />);
}

describe("<VacantPlaceListItem />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("pass params", () => {
    const { getByText, getByTitle } = render();
    expect(getByText("Place A")).toBeInTheDocument();
    expect(getByTitle("Fly to")).toBeInTheDocument();
  });

  test("onClick gets called upon Click", () => {
    const d = getDefault();
    const f = jest.fn();
    const { getByRole } = render({
      ...d,
      onClick: f
    });
    fireEvent.click(getByRole("button"));
    expect(f).toBeCalledTimes(1);
  });
});
