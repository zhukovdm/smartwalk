import { render } from "@testing-library/react";
import LoadingStub from "../LoadingStub";

describe("<LoadingStub />", () => {

  test("render", () => {
    const { container } = render(<LoadingStub />);
    expect(container).toBeTruthy();
  });
});
