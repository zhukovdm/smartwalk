import {
  render as rtlRender
} from "@testing-library/react";
import PlaceKeywords from "../PlaceKeywords";

const getDefault = () => ({ keywords: ["castle", "museum"] });

function render(props = getDefault()) {
  return rtlRender(<PlaceKeywords {...props} />);
}

describe("<PlaceKeywords />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("role", () => {
    const { getByRole } = render();
    expect(getByRole("list")).toBeInTheDocument();
  });

  test("generate items", () => {
    const { getAllByRole } = render();
    expect(getAllByRole("listitem").length).toEqual(2);
  });
});
