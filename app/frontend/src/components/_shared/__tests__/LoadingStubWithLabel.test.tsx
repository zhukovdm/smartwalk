import {
    RenderResult,
    render as rtlRender
} from "@testing-library/react";
import LoadingStubWithLabel from "../LoadingStubWithLabel";

function render(): RenderResult {
  return rtlRender(
    <LoadingStubWithLabel progress={17} />
  );
}

describe("<LoadingStubWithLabel />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("progress", () => {
    const { getByText } = render();
    expect(getByText("17%")).toBeInTheDocument();
  });
});
