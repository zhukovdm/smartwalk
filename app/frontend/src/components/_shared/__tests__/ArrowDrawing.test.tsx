import { render as rtlRender } from "@testing-library/react";
import { Network } from "vis-network";
import ArrowDrawing, { type ArrowDrawingProps } from "../ArrowDrawing";

jest.mock("vis-network", () => ({
  Network: jest.fn().mockImplementation(() => { })
}));

const getProps = (): ArrowDrawingProps => ({
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
  arrows: [
    { fr: 0, to: 1 },
    { fr: 1, to: 2 }
  ],
  arrow: { fr: 2, to: 0 }
});

function render(props = getProps()) {
  return rtlRender(<ArrowDrawing {...props} />);
}

describe("<ArrowDrawing />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("drawing constructor", () => {
    const { } = render();
    expect(Network).toHaveBeenCalledTimes(1);
  });
});
