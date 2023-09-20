import {
  render as rtlRender
} from "@testing-library/react";
import PrecedenceBox, { type PrecedenceBoxProps } from "../PrecedenceBox";

global.alert = jest.fn();

jest.mock("vis-network");

const getProps = (): PrecedenceBoxProps => ({
  categories: [
    { keyword: "a", filters: {} },
    { keyword: "b", filters: {} },
    { keyword: "c", filters: {} },
  ],
  precedence: [
    { fr: 0, to: 1 }
  ],
  deleteEdge: jest.fn(),
  appendEdge: jest.fn()
});

function render(props = getProps()) {
  return rtlRender(<PrecedenceBox {...props} />);
}

describe("<PrecedenceBox />", () => {

  test("render", () => {
    expect(render().container).toBeTruthy();
  });
});
