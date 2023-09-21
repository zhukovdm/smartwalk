import {
  act,
  fireEvent,
  waitFor,
  within
} from "@testing-library/react";
import { getPlace } from "../../utils/testData";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import { LeafletMap } from "../../utils/leaflet";
import { context } from "../../features/context";
import {
  initialSearchDirecsState
} from "../../features/searchDirecsSlice";
import SearchDirecsPanel from "../SearchDirecsPanel";

global.alert = jest.fn();
global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));

const getProps = (): {} => ({});

const getOptions = (): AppRenderOptions => ({});

function render(props = getProps(), options: AppRenderOptions = getOptions()) {
  return renderWithProviders(<SearchDirecsPanel {...props} />, options);
}

describe("<SearchDirecsPanel />", () => {

  test("render", () => {
    expect(render().container).toBeTruthy();
  });

  describe("sequence", () => {

    const wait = async (ms: number) => new Promise((resolve) => { setTimeout(resolve, ms); });

    /**
     * Point selection, dialog, and name replacement are tested
     * in the PanelDrawer.test.tsx
     */

    //

    it("should render link-based label for places with smartId", async () => {
      const { getByRole } = render(getProps(), {
        preloadedState: {
          searchDirecs: {
            ...initialSearchDirecsState(),
            waypoints: [
              {
                ...getPlace(),
                name: "Place A",
                placeId: "1",
                smartId: "A" // link
              },{
                ...getPlace(),
                name: "Place B",
                placeId: "2",
                smartId: "B" // link
              }
            ]
          }
        }
      });

      await waitFor(() => {
        expect(within(getByRole("list", { name: "Waypoints" }))
          .getByRole("link", { name: "Place A" })).toBeInTheDocument();
      });
    });

    it("should render text-based label for places without smartId", async () => {

      const { getByRole } = render(getProps(), {
        preloadedState: {
          searchDirecs: {
            ...initialSearchDirecsState(),
            waypoints: [
              {
                ...getPlace(),
                name: "Place A"
              }
            ]
          }
        }
      });
      const region = getByRole("list", { name: "Waypoints" });

      await waitFor(() => {
        expect(within(region).getByText("Place A")).toBeInTheDocument();
        expect(within(region).queryByRole("link")).not.toBeInTheDocument();
      });
    });

    it("should remove selected location upon clicking on Remove", async () => {

      const { getByRole } = render(getProps(), {
        preloadedState: {
          searchDirecs: {
            ...initialSearchDirecsState(),
            waypoints: [
              { ...getPlace(), name: "Place A" },
              { ...getPlace(), name: "Place B" },
              { ...getPlace(), name: "Place C" }
            ]
          }
        }
      });

      const list = getByRole("list", { name: "Waypoints" });

      await waitFor(() => {
        expect(within(list).queryAllByRole("listitem")).toHaveLength(3);
        expect(within(list).getByRole("listitem", { name: "Place B" })).toBeInTheDocument();
      })

      fireEvent.click(within(getByRole("listitem", { name: "Place B" }))
        .getByRole("button", { name: "Remove point" }));

      expect(within(list).queryAllByRole("listitem")).toHaveLength(2);
      expect(within(list).queryByRole("listitem", { name: "Place B" })).not.toBeInTheDocument();
    });

    it("should fly towards `i` point upon clicking on Fly to", async () => {

      const map = new LeafletMap();

      const flyTo = jest.spyOn(map, "flyTo").mockImplementation();
      const addCommon = jest.spyOn(map, "addCommon").mockImplementation(() => ({
        withDrag: jest.fn(),
        withCirc: jest.fn()
      }));

      const { getByRole } = render(getProps(), {
        preloadedState: {
          searchDirecs: {
            ...initialSearchDirecsState(),
            waypoints: ["A", "B", "C"].map((id) => ({
              ...getPlace(),
              name: `Place ${id}`
            }))
          }
        },
        context: { ...context, map }
      });

      await waitFor(() => {
        expect(within(getByRole("list", { name: "Waypoints" })).queryAllByRole("listitem")).not.toHaveLength(0);
      });

      expect(flyTo).toHaveBeenCalledTimes(0);
      expect(addCommon).toHaveBeenCalledTimes(3);

      fireEvent.click(within(getByRole("listitem", { name: "Place B" }))
        .getByRole("button", { name: "Fly to" }));

      expect(flyTo).toHaveBeenCalledTimes(1);
      expect(addCommon).toHaveBeenCalledTimes(3);
    });

    it("should allow to move a point to any position in the sequence", async () => {

      /**
       * This test does not do actual testing, see Issue #5.
       */

      //

      const { getByRole } = render(getProps(), {
        preloadedState: {
          searchDirecs: {
            ...initialSearchDirecsState(),
            waypoints: ["A", "B", "C"].map((id) => ({
              ...getPlace(),
              name: `Place ${id}`
            }))
          }
        },
      });

      await waitFor(() => {
        expect(within(getByRole("list", { name: "Waypoints" }))
          .queryAllByRole("listitem")).not.toHaveLength(0);
      });

      fireEvent.keyDown(within(getByRole("listitem", { name: "Place B" }))
        .getByRole("button", { name: "Drag" }), { key: "Tab" });

      await wait(100);

      fireEvent.keyDown(within(getByRole("listitem", { name: "Place B" }))
        .getByRole("button", { name: "Drag" }), { key: " " });
      
      await wait(100);

      fireEvent.keyDown(within(getByRole("listitem", { name: "Place B" }))
        .getByRole("button", { name: "Drag" }), { key: "ArrowUp" });

      await wait(100);

      fireEvent.keyDown(within(getByRole("listitem", { name: "Place B" }))
        .getByRole("button", { name: "Drag" }), { key: " " });

      await wait(100);
    });
  });

  describe("reverse button", () => {

    it("should reverse points in the sequence", async () => {

      const { getByRole, queryAllByRole } = render(getProps(), {
        preloadedState: {
          searchDirecs: {
            ...initialSearchDirecsState(),
            waypoints: ["A", "B", "C"].map((id) => ({
              ...getPlace(),
              name: `Place ${id}`
            }))
          }
        },
      });

      await waitFor(() => {
        expect(within(getByRole("list", { name: "Waypoints" }))
          .queryAllByRole("listitem")).not.toHaveLength(0);
      });

      const e0 = queryAllByRole("listitem");

      ["A", "B", "C"].forEach((id, index) => {
        within(e0[index]).getByText(`Place ${id}`);
      });

      act(() => {
        fireEvent.click(getByRole("button", { name: "Reverse" }));
      });

      const e1 = queryAllByRole("listitem");

      ["C", "B", "A"].forEach((id, index) => {
        within(e1[index]).getByText(`Place ${id}`);
      });
    });
  });

  describe("bottom buttons", () => {

    test("clear button should remove all points", async () => {

      const { getByRole } = render(getProps(), {
        preloadedState: {
          searchDirecs: {
            ...initialSearchDirecsState(),
            waypoints: ["A", "B", "C"].map((id) => ({
              ...getPlace(),
              name: `Place ${id}`
            }))
          }
        },
      });

      await waitFor(() => {
        expect(within(getByRole("list", { name: "Waypoints" }))
          .queryAllByRole("listitem")).toHaveLength(3);
      });

      act(() => {
        fireEvent.click(getByRole("button", { name: "Clear" }));
      });

      await waitFor(() => {
        expect(within(getByRole("list", { name: "Waypoints" }))
          .queryAllByRole("listitem")).toHaveLength(0);
      });
    });

    test("Search should be disabled for a sequence with <=1 points", async () => {

      const { getByRole } = render(getProps(), {
        preloadedState: {
          searchDirecs: {
            ...initialSearchDirecsState(),
            waypoints: ["A"].map((id) => ({
              ...getPlace(),
              name: `Place ${id}`
            }))
          }
        }
      });

      await waitFor(() => {
        expect(within(getByRole("list", { name: "Waypoints" }))
          .queryAllByRole("listitem")).toHaveLength(1);
      });

      expect(getByRole("button", { name: "Search" })).toBeDisabled();
    });

    test("Search should be enabled for a sequence with >=2 points", async () => {

      const { getByRole } = render(getProps(), {
        preloadedState: {
          searchDirecs: {
            ...initialSearchDirecsState(),
            waypoints: ["A", "B"].map((id) => ({
              ...getPlace(),
              name: `Place ${id}`
            }))
          }
        }
      });

      await waitFor(() => {
        expect(within(getByRole("list", { name: "Waypoints" }))
          .queryAllByRole("listitem")).toHaveLength(2);
      });

      expect(getByRole("button", { name: "Search" })).toBeEnabled();
    });
  });
});
