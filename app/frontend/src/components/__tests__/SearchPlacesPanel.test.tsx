import {
  act,
  fireEvent,
  waitFor,
  within
} from "@testing-library/react";
import { getKeywordAdviceItem, getPlace } from "../../utils/testData";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import { LeafletMap } from "../../utils/leaflet";
import * as smartwalkApi from "../../utils/smartwalk";
import { context } from "../../features/context";
import { initialSearchPlacesState } from "../../features/searchPlacesSlice";
import SearchPlacesPanel from "../SearchPlacesPanel";

global.alert = jest.fn();
global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));

jest.mock("axios");

const getProps = (): {} => ({});

const getOptions = (): AppRenderOptions => ({});

function render(props = getProps(), options: AppRenderOptions = getOptions()) {
  return renderWithProviders(<SearchPlacesPanel {...props} />, options);
}

describe("<SearchPlacesPanel />", () => {

  test("render", () => {
    expect(render().container).toBeTruthy();
  });

  describe("center box", () => {

    /**
     * Point selection, dialog, and name replacement are tested
     * in the PanelDrawer.test.tsx
     */

    //

    it("should render link-based label for places with smartId", () => {
      const { getByRole } = render(getProps(), {
        preloadedState: {
          searchPlaces: {
            ...initialSearchPlacesState(),
            center: {
              ...getPlace(),
              name: "Place A",
              placeId: "1",
              smartId: "A" // link
            }
          }
        }
      });
      expect(within(getByRole("region", { name: "Center point" }))
        .getByRole("link", { name: "Place A" })).toBeInTheDocument();
    });

    it("should render text-based label for places without smartId", () => {
      const { getByRole } = render(getProps(), {
        preloadedState: {
          searchPlaces: {
            ...initialSearchPlacesState(),
            center: {
              ...getPlace(),
              name: "Place A",
              placeId: "1"
            }
          }
        }
      });
      const region = getByRole("region", { name: "Center point" });

      expect(within(region).getByText("Place A")).toBeInTheDocument();
      expect(within(region).queryByRole("link")).not.toBeInTheDocument();
    });

    it("should remove added location upon clicking on the Remove", () => {

      const { getByRole, getByText } = render(getProps(), {
        preloadedState: {
          searchPlaces: {
            ...initialSearchPlacesState(),
            center: {
              ...getPlace(),
              name: "Place A"
            }
          }
        }
      });

      fireEvent.click(within(getByRole("region", { name: "Center point" }))
        .getByRole("button", { name: "Remove point" }));

      expect(getByText("Select center point...")).toBeInTheDocument();
    });

    it("should fly towards location upon clicking on Fly to", () => {
      const map = new LeafletMap();

      const flyTo = jest.spyOn(map, "flyTo").mockImplementation();

      const addCenter = jest.spyOn(map, "addCenter").mockImplementation(() => ({
        withDrag: jest.fn().mockImplementation(() => ({
          withCirc: jest.fn() // nested call due to a fluent interface
        })),
        withCirc: jest.fn()
      }));

      const { getByRole } = render(getProps(), {
        preloadedState: {
          searchPlaces: {
            ...initialSearchPlacesState(),
            center: {
              ...getPlace(),
              name: "Place A"
            }
          }
        },
        context: { ...context, map }
      });

      expect(flyTo).toHaveBeenCalledTimes(0);
      expect(addCenter).toHaveBeenCalledTimes(1);

      fireEvent.click(within(getByRole("region", { name: "Center point" }))
        .getByRole("button", { name: "Fly to" }));
      
      expect(flyTo).toHaveBeenCalledTimes(1);
      expect(addCenter).toHaveBeenCalledTimes(1);
    });
  });

  describe("distance slider", () => {

    it("should change value", () => {
      const { getByRole } = render();
      const slider = getByRole("slider", { name: "Maximum crow-fly distance from the center point" });
      expect(slider).toHaveValue("3")
      fireEvent.change(slider, { target: { value: 5 } });
      expect(slider).toHaveValue("5");
    });
  });

  describe("categories", () => {

    const getPreloadedState = () => ({
      searchPlaces: {
        ...initialSearchPlacesState(),
        categories: [
          {
            ...getKeywordAdviceItem(),
            keyword: "cafe",
            filters: {}
          }
        ]
      }
    });

    it("should allow to create new category", async () => {
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

      fireEvent.click(getByRole("button", { name: "Add category" }));
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

    it("should allow to create two identical categories", async () => {
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

    it("should allow to modify category filters", async () => {
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

    it("should allow to delete category", () => {
      const { getByRole } = render(getProps(), {
        ...getOptions(),
        preloadedState: getPreloadedState()
      });
      const list = getByRole("list", { name: "Categories" });
      expect(within(list).getAllByRole("listitem")).toHaveLength(1);

      fireEvent.keyUp(getByRole("button", { name: "1: cafe" }), { key: "Delete" });

      expect(within(list).queryAllByRole("listitem")).toHaveLength(0);
    });
  });

  describe("bottom buttons", () => {

    const getPreloadedState = () => ({
      searchPlaces: {
        center: {
          ...getPlace(),
          name: "Center"
        },
        categories: ["bridge", "castle"].map((keyword) => ({
          ...getKeywordAdviceItem(),
          keyword,
          filters: {}
        })),
        precedence: [
          { fr: 0, to: 1 }
        ],
        radius: 5.0,
      }
    })

    it("should reset the entire search form upon Clear", () => {
      const { getByRole, getByText } = render(getProps(), {
        preloadedState: getPreloadedState()
      });

      const catList = getByRole("list", { name: "Categories" });

      expect(getByText("Center")).toBeVisible();
      expect(getByRole("slider", { name: "Maximum crow-fly distance from the center point" })).toHaveValue("5");
      expect(within(catList).queryAllByRole("listitem")).toHaveLength(2);

      fireEvent.click(getByRole("button", { name: "Clear" }));

      expect(getByText("Select center point...")).toBeVisible();
      expect(getByRole("slider", { name: "Maximum crow-fly distance from the center point" })).toHaveValue("3");
      expect(within(catList).queryAllByRole("listitem")).toHaveLength(0);
    });

    it("should disable Search button if center is missing", () => {

      const { getByRole } = render(getProps(), {
        preloadedState: getPreloadedState()
      });

      expect(getByRole("button", { name: "Search" })).toBeEnabled();

      fireEvent.click(within(getByRole("region", { name: "Center point" }))
        .getByRole("button", { name: "Remove point" }));

      expect(getByRole("button", { name: "Search" })).toBeDisabled();
    });

    it("should left Search button enabled if no category is left", () => {

      const { getByRole } = render(getProps(), {
        preloadedState: getPreloadedState()
      });

      expect(getByRole("button", { name: "Search" })).toBeEnabled();

      ["bridge", "castle"].forEach((keyword) => {
        fireEvent.keyUp(getByRole("button", { name: `1: ${keyword}` }), { key: "Delete" })
      });

      expect(getByRole("button", { name: "Search" })).toBeEnabled();
    });
  });
});
