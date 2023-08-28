import { cleanup, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../utils/testUtils";
import SearchRoutesPanel from "../SearchRoutesPanel";

function render() {
  return renderWithProviders(<SearchRoutesPanel />, {});
}

describe("<SearchRoutesPanel />", () => {

  beforeEach(cleanup);

  test("simple render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("source button opens select dialog", () => {
    const { getByRole } = render();

    fireEvent.click(getByRole("button", { name: "Select starting point" }));
    expect(getByRole("dialog", { name: "Select point" })).toBeVisible();
  });

  test("source description opens select dialog", () => {
    const { getByRole, getByText } = render();

    fireEvent.click(getByText("Select starting point..."));
    expect(getByRole("dialog", { name: "Select point" })).toBeVisible();
  });

  test("target button opens select dialog", () => {
    const { getByRole } = render();

    fireEvent.click(getByRole("button", { name: "Select destination" }));
    expect(getByRole("dialog", { name: "Select point" })).toBeVisible();
  });

  test("target description opens select dialog", () => {
    const { getByRole, getByText } = render();

    fireEvent.click(getByText("Select destination..."));
    expect(getByRole("dialog", { name: "Select point" })).toBeVisible();
  });
});
