import { fireEvent, within } from "@testing-library/react";
import { LeafletMap } from "../../../utils/leaflet";
import { getPlace } from "../../../utils/testData";
import {
  AppRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import { context } from "../../../features/context";
import { initialFavoritesState } from "../../../features/favoritesSlice";
import { initialResultPlacesState } from "../../../features/resultPlacesSlice";
import ResultPlacesContent, {
  type ResultPlacesContentProps
} from "../ResultPlacesContent";

const getProps = (): ResultPlacesContentProps => ({
  result: {
    center: { ...getPlace(), name: "Center A", placeId: "1" },
    radius: 3.1,
    categories: [
      { keyword: "a", filters: {} },
      { keyword: "b", filters: {} },
      { keyword: "c", filters: {} }
    ],
    places: [
      // 00
      {
        ...getPlace(),
        smartId: "A",
        keywords: ["a", "k"],
        categories: [0],
        name: "Place A",
      },
      {
        ...getPlace(),
        smartId: "B",
        keywords: ["b", "l"],
        categories: [1],
        name: "Place B",
      },
      {
        ...getPlace(),
        smartId: "C",
        keywords: ["c", "m"],
        categories: [2],
        name: "Place C"
      },
      {
        ...getPlace(),
        smartId: "D",
        keywords: ["a", "b", "n"],
        categories: [0, 1],
        name: "Place D",
      },
      {
        ...getPlace(),
        smartId: "E",
        keywords: ["b", "c", "o"],
        categories: [1, 2],
        name: "Place E",
      },
      // 05
      {
        ...getPlace(),
        smartId: "F",
        keywords: ["a", "c", "p"],
        categories: [0, 2],
        name: "Place F"
      },
      {
        ...getPlace(),
        smartId: "G",
        keywords: ["a", "b", "c", "q"],
        categories: [0, 1, 2],
        name: "Place G"
      },
      {
        ...getPlace(),
        smartId: "H",
        keywords: ["a"],
        categories: [0],
        name: "Place H",
      },
      {
        ...getPlace(),
        smartId: "I",
        keywords: ["b"],
        categories: [1],
        name: "Place I",
      },
      {
        ...getPlace(),
        smartId: "J",
        keywords: ["c"],
        categories: [2],
        name: "Place J"
      },
      // 10
      {
        ...getPlace(),
        smartId: "K",
        keywords: ["a"],
        categories: [0],
        name: "Place K",
      }
    ]
  }
});

const getState = (): AppRenderOptions => ({
  preloadedState: {
    resultPlaces: {
      ...initialResultPlacesState(10),
      filters: Array(3).fill(undefined).map(() => true)
    }
  }
});

function render(props = getProps(), options: AppRenderOptions = getState()) {
  return renderWithProviders(<ResultPlacesContent {...props} />, options);
}

describe("<ResultPlacesContent />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  describe("header", () => {

    it("should generate for =1 place", () => {
      const { getByText } = render({
        result: {
          ...getProps().result,
          places: [
            {
              ...getPlace(),
              smartId: "A",
              keywords: ["a"],
              categories: [0],
              name: "Place A"
            }
          ]
        }
      });
      expect(getByText("Found a total of", { exact: false })).toHaveTextContent("Found a total of 1 place within a distance of at most 3.1 km around the center point:");
    });

    it("should generate for >1 places", () => {
      const { getByText } = render();
      expect(getByText("Found a total of", { exact: false })).toHaveTextContent("Found a total of 11 places within a distance of at most 3.1 km around the center point:");
    });
  });

  describe("center", () => {

    it("should generate region and primitives", () => {
      const { getByRole } = render();
      expect(getByRole("region", { name: "Center point" })).toBeInTheDocument();
    });

    it("should generate gray pin button", () => {
      const { getByRole } = render();
      expect(within(getByRole("region", { name: "Center point" }))
        .getByRole("button", { name: "Fly to" })).toBeInTheDocument();
    });

    it("should generate center label as text", () => {
      const { getByRole } = render();
      expect(within(getByRole("region", { name: "Center point" }))
        .getByText("Center A")).toBeInTheDocument();
    });

    it("should generate center label as link", () => {
      const { getByRole } = render({
        result: {
          ...getProps().result,
          center: {
            ...getProps().result.center,
            smartId: "A"
          }
        }
      });
      expect(within(getByRole("region", { name: "Center point" }))
        .getByRole("link", { name: "Center A" })).toBeInTheDocument();
    });

    it("should replace label if more recent appears in the storage", () => {
      const { getByRole } = render(getProps(), {
        preloadedState: {
          resultPlaces: getState().preloadedState?.resultPlaces,
          favorites: {
            ...initialFavoritesState(),
            places: [
              { ...getPlace(), placeId: "1", name: "Center B" }
            ]
          }
        }
      });
      expect(within(getByRole("region", { name: "Center point" }))
        .getByText("Center B")).toBeInTheDocument();
    });

    it("should fly to the center upon click on Fly to", () => {
      const map = new LeafletMap();
      const flyTo = jest.spyOn(map, "flyTo").mockImplementation(jest.fn());
      const { getByRole } = render(getProps(), {
        ...getState(),
        context: { ...context, map: map }
      });
      fireEvent.click(within(getByRole("region", { name: "Center point" }))
        .getByRole("button", { name: "Fly to" }));
      expect(flyTo).toHaveBeenCalledTimes(1);
    });
  });

  describe("category filters", () => {

    it("should generate list of filters", () => {
      const { getByRole } = render();
      const list = getByRole("list", { name: "Category filters" });
      expect(list).toBeInTheDocument();
      expect(within(list).getAllByRole("listitem")).toHaveLength(3);
      [
        "1: a",
        "2: b",
        "3: c"
      ].forEach((name) => {
        expect(within(list).getByRole("listitem", { name: name })).toBeInTheDocument();
      });
    });

    test("filter controls the corresponding category", () => {
      const { getByRole, getByText } = render();

      const without_1 = ["B", "C", "D", "E", "F", "G", "I", "J"];
      const without_1_2 = ["C", "E", "F", "G", "J"];

      fireEvent.click(within(getByRole("listitem", { name: "1: a" }))
        .getByRole("checkbox")); // hide
      without_1.forEach((name) => {
        expect(getByText(`Place ${name}`)).toBeInTheDocument();
      });

      fireEvent.click(within(getByRole("listitem", { name: "2: b" }))
        .getByRole("checkbox"));
      without_1_2.forEach((name) => {
        expect(getByText(`Place ${name}`)).toBeInTheDocument();
      });

      fireEvent.click(within(getByRole("listitem", { name: "2: b" }))
        .getByRole("checkbox"));
      
      without_1.forEach((name) => {
        expect(getByText(`Place ${name}`)).toBeInTheDocument();
      });
    });

    test("no filter hides all points", () => {
      const { getByRole, queryByText } = render();
      ["1: a", "2: b", "3: c"].forEach((name) => {
        fireEvent.click(within(getByRole("listitem", { name: name })).getByRole("checkbox"));
      });
      expect(queryByText("Place ", { exact: false })).not.toBeInTheDocument();
    });

    it("should reset pagination upon change", () => {
      const places = getProps().result.places;
      const { getByRole } = render({
        result: {
          ...getProps().result,
          places: [places, places].flat(1)
        }
      });
      expect(within(getByRole("navigation", { name: "pagination navigation" }))
        .getAllByRole("listitem")).toHaveLength(5);
      fireEvent.click(getByRole("button", { name: "Go to page 3" }));
      fireEvent.click(within(getByRole("listitem", { name: "1: a" }))
        .getByRole("checkbox"));
      expect(within(getByRole("navigation", { name: "pagination navigation" }))
        .getAllByRole("listitem")).toHaveLength(4);
      expect(getByRole("button", { name: "page 1" })).toBeInTheDocument();
    });

    it("should deactivate filter if no place was found", () => {
      const { getByRole } = render({
        result: {
          ...getProps().result,
          places: [
            {
              ...getPlace(),
              smartId: "A",
              keywords: ["a", "k"],
              categories: [0],
              name: "Place A",
            },
            {
              ...getPlace(),
              smartId: "C",
              keywords: ["c", "m"],
              categories: [2],
              name: "Place C"
            }
          ]
        }
      });
      ["2: b"].forEach((name) => {
        expect(within(getByRole("listitem", { name: name })).getByRole("checkbox")).toHaveAttribute("disabled");
      });
      ["1: a", "3: c"].forEach((name) => {
        expect(within(getByRole("listitem", { name: name })).getByRole("checkbox")).not.toHaveAttribute("disabled");
      });
    });
  });

  describe("pagination", () => {

    it("should have (N + 2) buttons", () => {
      const { getByRole } = render();
      expect(within(getByRole("navigation", { name: "pagination navigation" }))
        .getAllByRole("listitem")).toHaveLength(2 + 2);
    });

    it("should show Nth page upon click on N", () => {
      const { getByRole } = render();
      fireEvent.click(getByRole("button", { name: "Go to page 2" }));
      expect(within(getByRole("list", { name: "Places found" })).getAllByRole("listitem")).toHaveLength(1);
    });

    it("should show next page upon click on Next", () => {
      const { getByRole } = render();
      const list = getByRole("list", { name: "Places found" });
      expect(within(list).getAllByRole("listitem")).toHaveLength(10);
      fireEvent.click(getByRole("button", { name: "Go to next page" }));
      expect(within(list).getAllByRole("listitem")).toHaveLength(1);
    });

    it("should shop previous page upon click on Previous", () => {
      const { getByRole } = render(getProps(), {
        preloadedState: {
          resultPlaces: {
            ...initialResultPlacesState(10),
            page: 1,
            filters: Array(3).fill(undefined).map(() => true)
          }
        }
      });
      const list = getByRole("list", { name: "Places found" });
      expect(within(list).getAllByRole("listitem")).toHaveLength(1);
      fireEvent.click(getByRole("button", { name: "Go to previous page" }));
      expect(within(list).getAllByRole("listitem")).toHaveLength(10);
    });
  });

  describe("rows per page", () => {

    test("setting to <10 items per page should adjust list", () => {
      const { getAllByText, getByRole } = render();
      fireEvent.mouseDown(getByRole("button", { name: "10" }));
      fireEvent.click(getByRole("option", { name: "5" }));
      expect(getAllByText("Place ", { exact: false })).toHaveLength(5);
    });

    test("setting to >10 items per page should adjust list", () => {
      const { getAllByText, getByRole } = render();
      fireEvent.mouseDown(getByRole("button", { name: "10" }));
      fireEvent.click(getByRole("option", { name: "50" }));
      expect(getAllByText("Place ", { exact: false })).toHaveLength(11);
    });

    it("should reset pagination upon change", () => {
      const places = getProps().result.places;
      const { getByRole } = render({
        result: {
          ...getProps().result,
          places: [places, places].flat(1)
        }
      });
      expect(within(getByRole("navigation", { name: "pagination navigation" }))
        .getAllByRole("listitem")).toHaveLength(5);

      fireEvent.mouseDown(getByRole("button", { name: "10" }));
      fireEvent.click(getByRole("option", { name: "5" }));

      expect(within(getByRole("navigation", { name: "pagination navigation" }))
        .getAllByRole("listitem")).toHaveLength(7);
      expect(getByRole("button", { name: "page 1" })).toBeInTheDocument();
    });

    test("setting to <10 items per page should alter pagination", () => {
      const { getByRole } = render();
      fireEvent.mouseDown(getByRole("button", { name: "10" }));
      fireEvent.click(getByRole("option", { name: "5" }));
      expect(within(getByRole("navigation", { name: "pagination navigation" })).getAllByRole("listitem")).toHaveLength(3 + 2);
    });

    test("setting to >10 items per page should alter pagination", () => {
      const { getByRole } = render();
      fireEvent.mouseDown(getByRole("button", { name: "10" }));
      fireEvent.click(getByRole("option", { name: "50" }));
      expect(within(getByRole("navigation", { name: "pagination navigation" })).getAllByRole("listitem")).toHaveLength(1 + 2);
    });
  });

  describe("list of places", () => {

    it("should generate all labels as links", () => {
      const { getByRole } = render();
      expect(within(getByRole("list", { name: "Places found" }))
        .getAllByRole("link")).toHaveLength(10);
    });

    it("should replace names based on the latest available in the storage", () => {
      const { getByRole } = render(getProps(), {
        preloadedState: {
          ...getState().preloadedState,
          favorites: {
            ...initialFavoritesState(),
            places: [
              {
                ...getPlace(),
                smartId: "A", // <-
                placeId: "2",
                keywords: ["a", "k"],
                categories: [],
                name: "Place X"
              }
            ]
          }
        }
      });
      expect(getByRole("link", { name: "Place X" })).toBeInTheDocument();
    });

    it("should fly upon click on Fly to", () => {
      const map = new LeafletMap();
      const flyTo = jest.spyOn(map, "flyTo").mockImplementation(jest.fn());

      const { getByRole } = render(getProps(), {
        ...getState(),
        context: { ...context, map: map }
      });
      within(getByRole("list", { name: "Places found" }))
        .getAllByRole("button", { name: "Fly to" }).forEach((button) => {
          fireEvent.click(button);
        });
      expect(flyTo).toHaveBeenCalledTimes(10);
    });
  })
});
