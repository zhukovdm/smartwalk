import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import {
  RenderResult,
  cleanup,
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import { store } from "../../features/store";
import SearchRoutesPanel from "../SearchRoutesPanel";

function render(): RenderResult {
  return rtlRender(
    <Provider store={store}>
      <MemoryRouter>
        <SearchRoutesPanel />
      </MemoryRouter>
    </Provider>
  );
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
