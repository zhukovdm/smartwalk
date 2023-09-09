import {
  act,
  fireEvent,
  waitFor,
  within
} from "@testing-library/react";
import { LeafletMap } from "../../../utils/leaflet";
import { getDirec } from "../../../utils/testData";
import {
  AppRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import { context } from "../../../features/context";
import { initialResultDirecsState } from "../../../features/resultDirecsSlice";
import ResultDirecsContent from "../ResultDirecsContent";

const getState = (): AppRenderOptions => ({
  preloadedState: {
    resultDirecs: {
      ...initialResultDirecsState(),
      result: Array(3).fill(undefined).map(() => getDirec())
    }
  }
});

function render(options: AppRenderOptions = getState()) {
  return renderWithProviders(<ResultDirecsContent />, options);
}

describe("<ResultDirecsContent />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  it("should generate header for =1 direction", () => {
    const { getByText } = render({
      preloadedState: {
        resultDirecs: {
          ...initialResultDirecsState(),
          result: [getDirec()]
        }
      }
    });
    expect(getByText("Found a total of", { exact: false })).toHaveTextContent("Found a total of 1 direction.");
  });

  it("should generate header for >1 directions", () => {
    const { getByText } = render();
    expect(getByText("Found a total of", { exact: false })).toHaveTextContent("Found a total of 3 directions.");
  });

  describe("pagination", () => {

    it("should have (N + 2) buttons", () => {
      const { getByRole } = render();
      expect(within(getByRole("navigation", { name: "pagination navigation" }))
        .getAllByRole("listitem")).toHaveLength(3 + 2);
    });
  
    it("should show Nth direction upon click on N", () => {
      const { getByRole, queryByText } = render({
        preloadedState: {
          resultDirecs: {
            ...initialResultDirecsState(),
            result: [
              getDirec(),
              { ...getDirec(), name: "Direction B", direcId: "1" },
              getDirec()
            ]
          }
        }
      });
      expect(queryByText("Direction B")).not.toBeInTheDocument();
      fireEvent.click(getByRole("button", { name: "Go to page 2" }));
      expect(queryByText("Direction B")).toBeInTheDocument();
    });
  
    it("should show next direction upon click on Next", () => {
      const { getByRole, queryByText } = render({
        preloadedState: {
          resultDirecs: {
            ...initialResultDirecsState(),
            result: [
              getDirec(),
              { ...getDirec(), name: "Direction B", direcId: "1" },
              getDirec()
            ]
          }
        }
      });
      expect(queryByText("Direction B")).not.toBeInTheDocument();
      fireEvent.click(getByRole("button", { name: "Go to next page" }));
      expect(queryByText("Direction B")).toBeInTheDocument();
    });
  
    it("should show previous direction upon click on Previous", () => {
      const { getByRole, queryByText } = render({
        preloadedState: {
          resultDirecs: {
            ...initialResultDirecsState(),
            index: 1,
            result: [
              { ...getDirec(), name: "Direction A", direcId: "0" },
              getDirec(),
              getDirec()
            ]
          }
        }
      });
      expect(queryByText("Direction A")).not.toBeInTheDocument();
      fireEvent.click(getByRole("button", { name: "Go to previous page" }));
      expect(queryByText("Direction A")).toBeInTheDocument();
    });
  });

  it("should generate alert for stored direction", () => {
    const { getByText } = render({
      preloadedState: {
        resultDirecs: {
          ...initialResultDirecsState(),
          result: [
            { ...getDirec(), direcId: "1", name: "Direction A" }
          ]
        }
      }
    });
    expect(getByText("Saved as", { exact: false })).toHaveTextContent("Saved as Direction A.");
  });

  it("should generate alert for unstored direction", () => {
    const { getByText } = render();
    expect(getByText("This direction is not in your Favorites yet.")).toBeInTheDocument();
  });

  it("should generate distance without trailing zeros", () => {
    const { getByText } = render();
    expect(getByText("Walking", { exact: false })).toHaveTextContent("Walking distance: 3.1 km");
  });

  it("should generate list of waypoints", () => {
    const { getByRole } = render();
    expect(getByRole("list", { name: "Waypoints" })).toBeInTheDocument();
  });

  it("should refresh map for every direction", () => {
    const map = new LeafletMap();
    const clear = jest.spyOn(map, "clear").mockImplementation(jest.fn());
    const flyTo = jest.spyOn(map, "flyTo").mockImplementation(jest.fn());
    const addCommon = jest.spyOn(map, "addCommon").mockImplementation(jest.fn());
    const drawPolyline = jest.spyOn(map, "drawPolyline").mockImplementation(jest.fn());

    const { getByRole } = render({
      ...getState(),
      context: { ...context, map: map }
    });

    [
      [clear, 1],
      [flyTo, 0],
      [addCommon, 5],
      [drawPolyline, 1]
    ].forEach(([spy, times]) => {
      expect(spy).toHaveBeenCalledTimes(times as number);
    });

    fireEvent.click(getByRole("button", { name: "Go to page 2" }));

    [
      [clear, 2],
      [flyTo, 0],
      [addCommon, 10],
      [drawPolyline, 2]
    ].forEach(([spy, times]) => {
      expect(spy).toHaveBeenCalledTimes(times as number);
    });
  });

  test("control menu has only Save option", () => {
    const { getAllByRole, getByRole } = render();
    fireEvent.click(getByRole("button", { name: "Menu" }));
    expect(getByRole("menuitem", { name: "Save" })).toBeInTheDocument();
    expect(getAllByRole("menuitem")).toHaveLength(1);
  });

  test("control Save opens Save dialog", () => {
    const { getByRole } = render();
    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "Save" }));
    expect(getByRole("dialog", { name: "Save direction" })).toBeInTheDocument();
  });

  test("Discard clicked on Save dialog resets data items", async () => {
    const { getByRole, queryByRole } = render();
    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "Save" }));
    fireEvent.change(getByRole("textbox", { name: "Name" }), { target: { value: "Direction A" } });
    fireEvent.click(getByRole("button", { name: "Discard" }));
    await waitFor(() => {
      expect(queryByRole("dialog")).not.toBeInTheDocument();
    });
    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "Save" }));
    expect(getByRole("textbox", { name: "Name" })).toHaveValue("");
  });

  it("should disable Save action if entered name is an empty string", () => {
    const { getByRole } = render();
    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "Save" }));

    const saveButton = getByRole("button", { name: "Save" });
    const nameTextBox = getByRole("textbox", { name: "Name" });

    expect(saveButton).toHaveAttribute("disabled");

    fireEvent.change(nameTextBox, { target: { value: "   \t   " } });
    expect(saveButton).toHaveAttribute("disabled");

    fireEvent.change(nameTextBox, { target: { value: "   Aa   " } });
    expect(saveButton).not.toHaveAttribute("disabled");
  });

  it("should update state upon Save", async () => {

    const { getByRole, getByText, queryByRole, store } = render();

    expect(store.getState().favorites.direcs).toHaveLength(0);

    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "Save" }));
    fireEvent.change(getByRole("textbox", { name: "Name" }), { target: { value: "Direction A" } });

    act(() => {
      fireEvent.click(getByRole("button", { name: "Save" }));
    });
    await waitFor(() => {
      expect(queryByRole("dialog", { name: "Save direction" })).not.toBeInTheDocument();
    });
    expect(getByText("Direction A")).toBeInTheDocument();
    expect(store.getState().favorites.direcs).toHaveLength(1);
  });

  test("saved direction cannot be repeatedly saved", () => {
    const { getByRole } = render({
      preloadedState: {
        resultDirecs: {
          index: 0,
          result: [
            {
              ...getDirec(),
              name: "Direction A",
              direcId: "1"
            }
          ]
        }
      }
    });
    fireEvent.click(getByRole("button", { name: "Menu" }));
    expect(getByRole("menuitem", { name: "Save" })).toHaveAttribute("aria-disabled");
  });
});
