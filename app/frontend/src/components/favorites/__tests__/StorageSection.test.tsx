import { render as rtlRender } from "@testing-library/react";
import { withContext } from "../../../utils/testUtils";
import StorageSection from "../StorageSection";

const getDefault = () => ({});

function render(props = getDefault()) {
  return rtlRender(withContext(<StorageSection {...props} />));
}

describe("<StorageSection />", () => {
  
  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  it("should have alert", () => {
    const { getByRole } = render();
    expect(getByRole("alert")).toBeInTheDocument();
  })
});
