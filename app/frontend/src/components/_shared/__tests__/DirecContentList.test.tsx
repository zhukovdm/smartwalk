import { render } from "@testing-library/react";
import DirecContentList from "../DirecContentList";

describe("<DirecContentList />", () => {

  test("render", () => {
    const { container } = render(<DirecContentList places={[]} />);
    expect(container).toBeTruthy();
  });
});
