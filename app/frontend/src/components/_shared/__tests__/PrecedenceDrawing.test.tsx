import { render as rtlRender } from "@testing-library/react";
import { Network } from "vis-network";
import PrecedenceDrawing, {
  type PrecedenceDrawingProps
} from "../PrecedenceDrawing";

jest.mock("vis-network", () => ({
  Network: jest.fn().mockImplementation(() => { })
}));

const getDefault = (): PrecedenceDrawingProps => ({
  categories: [
    {
      keyword: "castle",
      filters: {}
    },
    {
      keyword: "museum",
      filters: {}
    },
    {
      keyword: "statue",
      filters: {}
    }
  ],
  precedence: [
    {
      fr: 0,
      to: 1
    },
    {
      fr: 1,
      to: 2
    }
  ],
  edge: {
    fr: 2,
    to: 0
  }
});

function render(props = getDefault()) {
  return rtlRender(<PrecedenceDrawing {...props} />);
}

describe("<PrecedenceDrawing />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("drawing constructor", () => {
    const { } = render();
    expect(Network).toHaveBeenCalledTimes(1);
  });
});
