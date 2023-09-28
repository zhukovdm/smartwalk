import {
  act,
  fireEvent,
  waitFor,
  within
} from "@testing-library/react";
import type { PrecedenceEdge } from "../../domain/types";
import {
  getKeywordAdviceItem,
  getPlace
} from "../../utils/testData";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import { LeafletMap } from "../../utils/leaflet";
import * as smartwalkApi from "../../utils/smartwalk";
import { context } from "../../features/context";
import { initialSearchRoutesState } from "../../features/searchRoutesSlice";
import SearchRoutesPanel from "../SearchRoutesPanel";

global.alert = jest.fn();
global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));

jest.mock("axios");
jest.mock("vis-network");

const getProps = (): {} => ({});

const getOptions = (): AppRenderOptions => ({});

function render(props = getProps(), options: AppRenderOptions = getOptions()) {
  return renderWithProviders(<SearchRoutesPanel {...props} />, options);
}

describe("<SearchRoutesPanel />", () => {

  test("render", () => {
    expect(render().container).toBeTruthy();
  });

  describe("source box", () => {

    /**
     * Point selection, dialog, and name replacement are tested
     * in PanelDrawer.test.tsx
     */

    //

    it("should render link-based label for places with smartId", () => {
      const { getByRole } = render(getProps(), {
        preloadedState: {
          searchRoutes: {
            ...initialSearchRoutesState(),
            source: {
              ...getPlace(),
              name: "Place A",
              placeId: "1",
              smartId: "A"
            }
          }
        }
      });
      expect(within(getByRole("region", { name: "Starting point" }))
        .getByRole("link", { name: "Place A" })).toBeInTheDocument();
    });

    it("should render text-based label for places without smartId", () => {
      const { getByRole } = render(getProps(), {
        preloadedState: {
          searchRoutes: {
            ...initialSearchRoutesState(),
            source: {
              ...getPlace(),
              name: "Place A",
              placeId: "1"
            }
          }
        }
      });
      const region = getByRole("region", { name: "Starting point" });

      expect(within(region).getByText("Place A")).toBeInTheDocument();
      expect(within(region).queryByRole("link")).not.toBeInTheDocument();
    });

    it("should remove added location upon clicking on the Remove", () => {

      const { getByRole, getByText } = render(getProps(), {
        preloadedState: {
          searchRoutes: {
            ...initialSearchRoutesState(),
            source: {
              ...getPlace(),
              name: "Place A"
            }
          }
        }
      });

      fireEvent.click(within(getByRole("region", { name: "Starting point" }))
        .getByRole("button", { name: "Remove point" }));

      expect(getByText("Select starting point...")).toBeInTheDocument();
    });

    it("should fly towards location upon clicking on Fly to", () => {
      const map = new LeafletMap();

      const flyTo = jest.spyOn(map, "flyTo").mockImplementation();
      const addSource = jest.spyOn(map, "addSource").mockImplementation(() => ({
        withDrag: jest.fn(),
        withCirc: jest.fn()
      }));

      const { getByRole } = render(getProps(), {
        preloadedState: {
          searchRoutes: {
            ...initialSearchRoutesState(),
            source: {
              ...getPlace(),
              name: "Place A"
            }
          }
        },
        context: { ...context, map }
      });

      expect(flyTo).toHaveBeenCalledTimes(0);
      expect(addSource).toHaveBeenCalledTimes(1);

      fireEvent.click(within(getByRole("region", { name: "Starting point" }))
        .getByRole("button", { name: "Fly to" }));
      
      expect(flyTo).toHaveBeenCalledTimes(1);
      expect(addSource).toHaveBeenCalledTimes(1);
    });
  });

  describe("target box", () => {

    /**
     * Point selection, dialog, ane name replacement are tested
     * in PanelDrawer.test.tsx
     */

    //

    it("should render link-based label for places with smartId", () => {
      const { getByRole } = render(getProps(), {
        preloadedState: {
          searchRoutes: {
            ...initialSearchRoutesState(),
            target: {
              ...getPlace(),
              name: "Place A",
              placeId: "1",
              smartId: "A"
            }
          }
        }
      });
      expect(within(getByRole("region", { name: "Destination" }))
        .getByRole("link", { name: "Place A" })).toBeInTheDocument();
    });

    it("should render text-based label for places without smartId", () => {
      const { getByRole } = render(getProps(), {
        preloadedState: {
          searchRoutes: {
            ...initialSearchRoutesState(),
            target: {
              ...getPlace(),
              name: "Place A",
              placeId: "1"
            }
          }
        }
      });
      const region = getByRole("region", { name: "Destination" });

      expect(within(region).getByText("Place A")).toBeInTheDocument();
      expect(within(region).queryByRole("link")).not.toBeInTheDocument();
    });

    it("should remove added location upon clicking on the Remove", () => {

      const { getByRole, getByText } = render(getProps(), {
        preloadedState: {
          searchRoutes: {
            ...initialSearchRoutesState(),
            target: {
              ...getPlace(),
              name: "Place A"
            }
          }
        }
      });

      fireEvent.click(within(getByRole("region", { name: "Destination" }))
        .getByRole("button", { name: "Remove point" }));

      expect(getByText("Select destination...")).toBeInTheDocument();
    });

    it("should fly towards location upon clicking on Fly to", () => {
      const map = new LeafletMap();

      const flyTo = jest.spyOn(map, "flyTo").mockImplementation();
      const addTarget = jest.spyOn(map, "addTarget").mockImplementation(() => ({
        withDrag: jest.fn(),
        withCirc: jest.fn()
      }));

      const { getByRole } = render(getProps(), {
        preloadedState: {
          searchRoutes: {
            ...initialSearchRoutesState(),
            target: {
              ...getPlace(),
              name: "Place A"
            }
          }
        },
        context: { ...context, map }
      });

      expect(flyTo).toHaveBeenCalledTimes(0);
      expect(addTarget).toHaveBeenCalledTimes(1);

      fireEvent.click(within(getByRole("region", { name: "Destination" }))
        .getByRole("button", { name: "Fly to" }));
      
      expect(flyTo).toHaveBeenCalledTimes(1);
      expect(addTarget).toHaveBeenCalledTimes(1);
    });
  });

  describe("swap button", () => {

    it("does nothing when both slots are empty", () => {
      const { getByRole } = render();
      fireEvent.click(getByRole("button", { name: "Swap points" }));

      expect(within(getByRole("region", { name: "Starting point" }))
        .getByText("Select starting point...")).toBeInTheDocument();

      expect(within(getByRole("region", { name: "Destination" }))
        .getByText("Select destination...")).toBeInTheDocument();
    });

    it("should swap vacant and occupied slots", () => {

      const { getByRole } = render(getProps(), {
        preloadedState: {
          searchRoutes: {
            ...initialSearchRoutesState(),
            source: {
              ...getPlace(),
              name: "Place A"
            }
          }
        }
      });
      expect(within(getByRole("region", { name: "Starting point" })).getByText("Place A"));
      expect(within(getByRole("region", { name: "Destination" })).getByText("Select destination..."));

      fireEvent.click(getByRole("button", { name: "Swap points" }));

      expect(within(getByRole("region", { name: "Starting point" })).getByText("Select starting point..."));
      expect(within(getByRole("region", { name: "Destination" })).getByText("Place A"));
    });

    it("should swap two points", () => {
      const { getByRole } = render(getProps(), {
        ...getOptions(),
        preloadedState: {
          searchRoutes: {
            ...initialSearchRoutesState(),
            source: {
              ...getPlace(),
              name: "Source"
            },
            target: {
              ...getPlace(),
              name: "Target"
            }
          }
        }
      });
      expect(within(getByRole("region", { name: "Starting point" })).getByText("Source"));
      expect(within(getByRole("region", { name: "Destination" })).getByText("Target"));

      fireEvent.click(getByRole("button", { name: "Swap points" }));

      expect(within(getByRole("region", { name: "Starting point" })).getByText("Target"));
      expect(within(getByRole("region", { name: "Destination" })).getByText("Source"));
    });
  });

  describe("distance slider", () => {

    it("should change value", () => {
      const { getByRole } = render();
      const slider = getByRole("slider", { name: "Maximum walking distance of a route" });
      expect(slider).toHaveValue("5")
      act(() => {
        fireEvent.change(slider, { target: { value: 7 } });
      });
      expect(slider).toHaveValue("7");
    });
  });

  describe("categories", () => {

    const getPreloadedState = () => ({
      searchRoutes: {
        ...initialSearchRoutesState(),
        categories: [
          {
            ...getKeywordAdviceItem(),
            keyword: "cafe",
            filters: {}
          }
        ]
      }
    });

    it("should allow the user to create new category", async () => {
      jest.spyOn(smartwalkApi, "fetchAdviceKeywords").mockResolvedValueOnce([
        { ...getKeywordAdviceItem(), keyword: "cafe" },
        { ...getKeywordAdviceItem(), keyword: "castle" }
      ]);
      const { getByRole, queryByRole } = render(getProps(), {
        ...getOptions(),
        preloadedState: getPreloadedState()
      });

      const list = getByRole("list", { name: "Categories" });
      expect(within(list).getAllByRole("listitem")).toHaveLength(1);

      act(() => {
        fireEvent.click(getByRole("button", { name: "Add category" }));
      });
      act(() => {
        fireEvent.change(getByRole("combobox", { name: "Keyword" }), { target: { value: "c" } });
      });
      await waitFor(() => {
        expect(queryByRole("progressbar")).not.toBeInTheDocument();
      });
      fireEvent.click(getByRole("option", { name: "castle" }));
      fireEvent.click(getByRole("button", { name: "Confirm" }));

      expect(within(list).getByText("2: castle"));
      expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    });

    it("should allow the user to create two identical categories", async () => {
      jest.spyOn(smartwalkApi, "fetchAdviceKeywords").mockResolvedValueOnce([
        { ...getKeywordAdviceItem(), keyword: "cafe" },
        { ...getKeywordAdviceItem(), keyword: "castle" }
      ]);
      const { getByRole, queryByRole } = render(getProps(), {
        ...getOptions(),
        preloadedState: getPreloadedState()
      });

      const list = getByRole("list", { name: "Categories" });
      expect(within(list).getAllByRole("listitem")).toHaveLength(1);

      act(() => {
        fireEvent.click(getByRole("button", { name: "Add category" }));
      });
      act(() => {
        fireEvent.change(getByRole("combobox", { name: "Keyword" }), { target: { value: "c" } });
      });
      await waitFor(() => {
        expect(queryByRole("progressbar")).not.toBeInTheDocument();
      });
      fireEvent.click(getByRole("option", { name: "cafe" }));
      fireEvent.click(getByRole("button", { name: "Confirm" }));

      expect(within(list).getByText("2: cafe"));
      expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    });

    it("should allow the user to modify category filters", async () => {
      const { getByRole } = render(getProps(), {
        ...getOptions(),
        preloadedState: getPreloadedState()
      });

      fireEvent.click(getByRole("button", { name: "1: cafe" }));
      expect(getByRole("checkbox", { name: "website" })).toHaveProperty("checked", false);

      fireEvent.click(getByRole("checkbox", { name: "website" }));
      expect(getByRole("checkbox", { name: "website" })).toHaveProperty("checked", true);

      act(() => {
        fireEvent.click(getByRole("button", { name: "Confirm" }));
      });

      fireEvent.click(getByRole("button", { name: "1: cafe" }));
      await waitFor(() => {
        expect(getByRole("checkbox", { name: "website" })).toHaveProperty("checked", true);
      });
    }, 10000);

    it("should discard filter changes if not confirmed", async () => {
      const { getByRole } = render(getProps(), {
        ...getOptions(),
        preloadedState: getPreloadedState()
      });
      fireEvent.click(getByRole("button", { name: "1: cafe" }));
      expect(getByRole("checkbox", { name: "website" })).toHaveProperty("checked", false);

      fireEvent.click(getByRole("checkbox", { name: "website" }));
      expect(getByRole("checkbox", { name: "website" })).toHaveProperty("checked", true);

      act(() => {
        fireEvent.click(getByRole("button", { name: "Discard" }));
      });

      fireEvent.click(getByRole("button", { name: "1: cafe" }));

      await waitFor(() => {
        expect(getByRole("checkbox", { name: "website" })).toHaveProperty("checked", false);
      });
    }, 10000);

    it("should allow the user to delete category (with relabel)", () => {
      const { getByRole } = render(getProps(), {
        ...getOptions(),
        preloadedState: {
          searchRoutes: {
            ...initialSearchRoutesState(),
            categories: ["a", "b", "c"].map((keyword) => ({
              ...getKeywordAdviceItem(),
              keyword,
              filters: {}
            }))
          }
        }
      });
      const list = getByRole("list", { name: "Categories" });
      expect(within(list).getAllByRole("button")).toHaveLength(3);

      fireEvent.keyUp(getByRole("button", { name: "2: b" }), { key: "Delete" });

      expect(within(list).queryAllByRole("button")).toHaveLength(2);
      expect(within(list).getByRole("button", { name: "1: a" }));
      expect(within(list).getByRole("button", { name: "2: c" }));
    });
  });

  describe("arrows", () => {

    const getPreloadedState = (arrows: PrecedenceEdge[]) => ({
      searchRoutes: {
        ...initialSearchRoutesState(),
        categories: ["bridge", "castle", "museum", "statue"].map((keyword) => ({
          ...getKeywordAdviceItem(),
          keyword,
          filters: {}
        })),
        arrows
      }
    });

    it("should allow the user to create a new arrow", async () => {
      const { getByRole, getByLabelText } = render(getProps(), {
        ...getOptions(),
        preloadedState: getPreloadedState([
          { fr: 0, to: 1 },
          { fr: 2, to: 3 }
        ])
      });

      const list = getByRole("list", { name: "Arrows" });
      expect(within(list).queryAllByRole("listitem")).toHaveLength(2);

      fireEvent.click(getByRole("button", { name: "Add arrow" }));

      fireEvent.mouseDown(within(getByLabelText("this category")).getByRole("button"));
      fireEvent.click(getByRole("option", { name: "2: castle" }));

      fireEvent.mouseDown(within(getByLabelText("that category")).getByRole("button"));
      fireEvent.click(getByRole("option", { name: "3: museum" }));

      fireEvent.click(getByRole("button", { name: "Confirm" }));

      await waitFor(() => {
        expect(within(list).queryAllByRole("listitem")).toHaveLength(3);
        expect(within(list).queryByText("1 → 2")).toBeInTheDocument();
        expect(within(list).queryByText("2 → 3")).toBeInTheDocument(); // new
        expect(within(list).queryByText("3 → 4")).toBeInTheDocument();
      });
    }, 10000);

    it("should reject repeated arrows", async () => {
      const alert = jest.spyOn(window, "alert");

      const { getByRole, getByLabelText } = render(getProps(), {
        ...getOptions(),
        preloadedState: getPreloadedState([
          { fr: 0, to: 1 },
          { fr: 2, to: 3 }
        ])
      });

      fireEvent.click(getByRole("button", { name: "Add arrow" }));

      fireEvent.mouseDown(within(getByLabelText("this category")).getByRole("button"));
      fireEvent.click(getByRole("option", { name: "1: bridge" }));

      fireEvent.mouseDown(within(getByLabelText("that category")).getByRole("button"));
      fireEvent.click(getByRole("option", { name: "2: castle" }));

      fireEvent.click(getByRole("button", { name: "Confirm" }));

      expect(getByRole("dialog", { name: "Add arrow" })).toBeVisible();
      expect(alert).toHaveBeenCalledWith("Repeated arrow 1 → 2 detected, try another one.");
    }, 10000);

    it("should reject cyclic arrows", async () => {
      const alert = jest.spyOn(window, "alert");

      const { getByRole, getByLabelText } = render(getProps(), {
        ...getOptions(),
        preloadedState: getPreloadedState([
          { fr: 0, to: 1 },
          { fr: 2, to: 3 }
        ])
      });

      fireEvent.click(getByRole("button", { name: "Add arrow" }));

      fireEvent.mouseDown(within(getByLabelText("this category")).getByRole("button"));
      fireEvent.click(getByRole("option", { name: "2: castle" }));

      fireEvent.mouseDown(within(getByLabelText("that category")).getByRole("button"));
      fireEvent.click(getByRole("option", { name: "1: bridge" }));

      fireEvent.click(getByRole("button", { name: "Confirm" }));

      expect(getByRole("dialog", { name: "Add arrow" })).toBeVisible();
      expect(alert).toHaveBeenCalledWith("Cycle 1 → 2 → 1 detected, try another arrow.");
    });

    it("should remove all arrows if any category is removed", () => {
      const { getByRole } = render(getProps(), {
        ...getOptions(),
        preloadedState: getPreloadedState([
          { fr: 0, to: 1 },
          { fr: 2, to: 3 }
        ])
      });
      const arrows = getByRole("list", { name: "Arrows" });

      expect(within(arrows).queryAllByRole("listitem")).toHaveLength(2);
      fireEvent.keyUp(within(getByRole("list", { name: "Categories" }))
        .getByRole("button", { name: "4: statue" }), { key: "Delete" });
      expect(within(arrows).queryAllByRole("listitem")).toHaveLength(0);
    });

    it("should allow the user to delete an arrow", () => {
      const { getByRole } = render(getProps(), {
        ...getOptions(),
        preloadedState: getPreloadedState([
          { fr: 0, to: 1 },
          { fr: 1, to: 2 },
          { fr: 2, to: 3 }
        ])
      });

      const list = getByRole("list", { name: "Arrows" });
      expect(within(list).getAllByRole("listitem")).toHaveLength(3);

      fireEvent.keyUp(within(list).getByRole("button", { name: "2 → 3" }), { key: "Delete" });

      expect(within(list).getAllByRole("listitem")).toHaveLength(2);
      expect(within(list).getByRole("button", { name: "1 → 2" })).toBeInTheDocument();
      expect(within(list).getByRole("button", { name: "3 → 4" })).toBeInTheDocument();
    });
  });

  describe("bottom buttons", () => {

    const getPreloadedState = () => ({
      searchRoutes: {
        source: {
          ...getPlace(),
          name: "Source"
        },
        target: {
          ...getPlace(),
          name: "Target"
        },
        categories: ["bridge", "castle"].map((keyword) => ({
          ...getKeywordAdviceItem(),
          keyword,
          filters: {}
        })),
        arrows: [
          { fr: 0, to: 1 }
        ],
        maxDistance: 3.1,
      }
    });

    it("should reset the entire search form upon Clear", () => {
      const { getByRole, getByText } = render(getProps(), {
        preloadedState: getPreloadedState()
      });

      const arrList = getByRole("list", { name: "Arrows" });
      const catList = getByRole("list", { name: "Categories" });

      expect(getByText("Source")).toBeVisible();
      expect(getByText("Target")).toBeVisible();
      expect(getByRole("slider", { name: "Maximum walking distance of a route" })).toHaveValue("3.1");
      expect(within(catList).queryAllByRole("listitem")).toHaveLength(2);
      expect(within(arrList).queryAllByRole("listitem")).toHaveLength(1);

      fireEvent.click(getByRole("button", { name: "Clear" }));

      expect(getByText("Select starting point...")).toBeVisible();
      expect(getByText("Select destination...")).toBeVisible();
      expect(getByRole("slider", { name: "Maximum walking distance of a route" })).toHaveValue("5");
      expect(within(catList).queryAllByRole("listitem")).toHaveLength(0);
      expect(within(arrList).queryAllByRole("listitem")).toHaveLength(0);
    });

    it("should disable Search button if source is missing", () => {

      const { getByRole } = render(getProps(), {
        preloadedState: getPreloadedState()
      });

      expect(getByRole("button", { name: "Search" })).toBeEnabled();

      fireEvent.click(within(getByRole("region", { name: "Starting point" }))
        .getByRole("button", { name: "Remove point" }));

      expect(getByRole("button", { name: "Search" })).toBeDisabled();
    });

    it("should disable Search button if target is missing", () => {

      const { getByRole } = render(getProps(), {
        preloadedState: getPreloadedState()
      });

      expect(getByRole("button", { name: "Search" })).toBeEnabled();

      fireEvent.click(within(getByRole("region", { name: "Destination" }))
        .getByRole("button", { name: "Remove point" }));

      expect(getByRole("button", { name: "Search" })).toBeDisabled();
    });

    it("should disable Search button if no category is left", () => {

      const { getByRole } = render(getProps(), {
        preloadedState: getPreloadedState()
      });

      expect(getByRole("button", { name: "Search" })).toBeEnabled();

      ["bridge", "castle"].forEach((keyword) => {
        fireEvent.keyUp(getByRole("button", { name: `1: ${keyword}` }), { key: "Delete" })
      });

      expect(getByRole("button", { name: "Search" })).toBeDisabled();
    });

    it("should left Search button enabled if no arrow is left", () => {

      const { getByRole } = render(getProps(), {
        preloadedState: getPreloadedState()
      });

      expect(getByRole("button", { name: "Search" })).toBeEnabled();
      fireEvent.keyUp(within(getByRole("list", { name: "Arrows" })).getByRole("button"), { key: "Delete" });
      expect(getByRole("button", { name: "Search" })).toBeEnabled();
    });
  });
});
