import { act, fireEvent, waitFor } from "@testing-library/react";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import * as panelHooks from "../../features/panelHooks";
import * as solidFuncs from "../../utils/solidProvider";
import { initialSolidState } from "../../features/solidSlice";
import { initialFavoritesState } from "../../features/favoritesSlice";
import PanelEnsemble from "../PanelEnsemble";

global.alert = jest.fn();

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate
}));

const getOptions = (): AppRenderOptions => ({
  preloadedState: {
    favorites: {
      ...initialFavoritesState(),
      loaded: true
    }
  }
});

function render(options: AppRenderOptions = getOptions()) {
  return renderWithProviders(<PanelEnsemble />, options);
}

describe("<PanelEnsemble />", () => {

  /**
   * Most of the non-solid panel interactions are tested in the PanelDrawer.test.tsx
   */
  ///

  type T = ReturnType<typeof renderWithProviders>;

  test("render", () => {
    jest.spyOn(panelHooks, "useFavorites").mockImplementation();
    expect(render().container).toBeTruthy();
  });

  it("should redirect to the Solid panel upon incoming redirect", async () => {

    jest.spyOn(solidFuncs, "solidRedirect").mockImplementation((onLogin) => {
      onLogin("https://www.profile.com/A");
      return Promise.resolve();
    });

    act(() => {
      render();
    });

    await waitFor(() => {
      expect(mockUseNavigate).toHaveBeenCalledWith("/session/solid");
    });
  });

  it("should render Solid session on the panel if the session state is set", async () => {

    jest.spyOn(solidFuncs, "solidRedirect").mockResolvedValueOnce(undefined);
    jest.spyOn(solidFuncs, "getAvailableSolidPods").mockResolvedValueOnce([]);

    let renderOptions: T;

    act(() => {
      renderOptions = render({
        preloadedState: {
          session: {
            login: true,
            solid: true
          },
          solid: {
            ...initialSolidState(),
            redirect: true,
            webId: "https://www.profile.com/A"
          }
        },
        routerProps: {
          initialEntries: [
            "/session/solid"
          ]
        }
      });
    });

    await waitFor(() => {
      expect(renderOptions.getByRole("button", { name: "Log out" })).toBeInTheDocument();
    });
  });

  it("should download the list of available Solid Pods", async () => {

    jest.spyOn(solidFuncs, "solidRedirect").mockResolvedValueOnce(undefined);
    jest.spyOn(solidFuncs, "getAvailableSolidPods").mockResolvedValueOnce(["A", "B", "C"].map((podId) => (
      `https://www.storage.com/${podId}`
    )));

    let renderOptions: T;

    act(() => {
      renderOptions = render({
        preloadedState: {
          session: {
            login: true,
            solid: true
          },
          solid: {
            ...initialSolidState(),
            redirect: true,
            webId: "https://www.profile.com/A"
          }
        },
        routerProps: {
          initialEntries: [
            "/session/solid"
          ]
        }
      });
    });

    await waitFor(() => {
      expect(renderOptions.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    const { getByRole, queryAllByRole } = renderOptions!;

    fireEvent.click(getByRole("button", { name: "Open" }));
    expect(queryAllByRole("option")).toHaveLength(3);
  });

  it("should call logout callback upon Log out", async () => {
    jest.spyOn(panelHooks, "useFavorites").mockImplementation();

    jest.spyOn(solidFuncs, "solidRedirect").mockImplementation(() => {
      return Promise.resolve();
    });

    jest.spyOn(solidFuncs, "getAvailableSolidPods").mockResolvedValueOnce(["A", "B", "C"].map((podId) => (
      `https://www.storage.com/${podId}`
    )));

    const logoutSpy = jest.spyOn(solidFuncs, "solidLogout");

    let renderOptions: T;

    act(() => {
      renderOptions = render({
        preloadedState: {
          session: {
            login: true,
            solid: true
          },
          solid: {
            ...initialSolidState(),
            redirect: true,
            webId: "https://www.profile.com/A"
          }
        },
        routerProps: {
          initialEntries: [
            "/session/solid"
          ]
        }
      });
    });

    await waitFor(() => {
      expect(renderOptions.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    const { getByRole } = renderOptions!;

    await act(async () => {
      fireEvent.click(getByRole("button", { name: "Log out" }));
    });
    await waitFor(() => {
      expect(logoutSpy).toHaveBeenCalled();
    })
  });

  it("should redirect to the solid panel upon clicking on `Solid` if solid session is active", async () => {

    jest.spyOn(solidFuncs, "solidRedirect").mockResolvedValueOnce(undefined);
    jest.spyOn(solidFuncs, "getAvailableSolidPods").mockResolvedValueOnce([]);

    let renderOptions: T;

    act(() => {
      renderOptions = render({
        preloadedState: {
          session: {
            login: true,
            solid: true
          },
          solid: {
            ...initialSolidState(),
            redirect: true,
            webId: "https://www.profile.com/A"
          },
          favorites: {
            ...initialFavoritesState(),
            loaded: true
          }
        },
        routerProps: {
          initialEntries: [
            "/favorites"
          ]
        }
      });
    });

    await waitFor(() => {
      expect(renderOptions.getByRole("button", { name: "Solid" })).toBeInTheDocument();
    });

    const { getByRole } = renderOptions!;
    fireEvent.click(getByRole("button", { name: "Solid" }));
    expect(mockUseNavigate).toHaveBeenCalledWith("/session/solid");
  });
});
