import { act, waitFor } from "@testing-library/react";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import * as solidFuncs from "../../utils/solidProvider";
import SessionSolidPanel from "../SessionSolidPanel";
import { initialSolidState } from "../../features/solidSlice";

const getOptions = (): AppRenderOptions => ({});

function render(options: AppRenderOptions = getOptions()) {
  return renderWithProviders(<SessionSolidPanel />, options);
}

describe("<SessionSolidPanel />", () => {

  type T = ReturnType<typeof renderWithProviders>;

  test("render", () => {
    expect(render()).toBeTruthy();
  });

  test("render alert if not login or solid", () => {
    expect(render().getByRole("alert")).toBeInTheDocument();
  });

  test("render panel if login and solid", async () => {

    let renderOptions: T;

    jest.spyOn(solidFuncs, "getAvailableSolidPods").mockResolvedValueOnce([]);

    act(() => {
      renderOptions = render({
        preloadedState: {
          session: {
            login: true,
            solid: true
          },
          solid: {
            ...initialSolidState(),
            activated: true,
            redirect: true,
            webId: "https://www.profile.com/A",
            selectedPod: "https://www.storage.com/A"
          }
        },
        routerProps: {
          initialEntries: [
            "/session/solid"
          ]
        }
      })
    });

    await waitFor(() => {
      expect(renderOptions.getByText("https://www.profile.com/A"));
    });
  });
});
