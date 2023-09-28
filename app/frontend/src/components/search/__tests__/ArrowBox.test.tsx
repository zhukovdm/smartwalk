import {
  render as rtlRender
} from "@testing-library/react";
import ArrowBox, { type ArrowBoxProps } from "../ArrowBox";

global.alert = jest.fn();

jest.mock("vis-network");

const getProps = (): ArrowBoxProps => ({
  categories: [
    { keyword: "a", filters: {} },
    { keyword: "b", filters: {} },
    { keyword: "c", filters: {} },
  ],
  arrows: [
    { fr: 0, to: 1 }
  ],
  deleteArrow: jest.fn(),
  appendArrow: jest.fn()
});

function render(props = getProps()) {
  return rtlRender(<ArrowBox {...props} />);
}

describe("<ArrowBox />", () => {

  test("render", () => {
    expect(render().container).toBeTruthy();
  });
});
