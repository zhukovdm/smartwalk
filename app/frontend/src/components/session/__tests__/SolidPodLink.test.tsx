import { render } from "@testing-library/react";
import SolidPodLink from "../SolidPodLink"

describe("<SolidPodLink />", () => {
  
  test("render", () => {
    const { getByRole } = render(<SolidPodLink />);
    expect(getByRole("link")).toBeInTheDocument();
  });
})
