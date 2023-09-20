import { fireEvent } from "@testing-library/react";
import { LeafletMap } from "../../../utils/leaflet";
import { getPlace } from "../../../utils/testData";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import { context } from "../../../features/context";
import { initialPanelState } from "../../../features/panelSlice";
import { initialFavoritesState } from "../../../features/favoritesSlice";
import SelectPointDialog, {
  type SelectPointDialogProps
} from "../SelectPointDialog";

const getProps = (): SelectPointDialogProps => ({
  show: true,
  kind: "common",
  onHide: jest.fn(),
  onSelect: jest.fn()
});

function render(props = getProps(), options: AppRenderOptions = {}) {
  return renderWithProviders(<SelectPointDialog {...props} />, options);
}

describe("<SelectPointDialog />", () => {
  
  test("render", () => { expect(render().container).toBeTruthy(); });

  test("button enforces the workflow", () => {
    const onHide = jest.fn();
    const onSelect = jest.fn();

    const map = new LeafletMap();
    const captureLocation = jest.spyOn(map, "captureLocation").mockImplementation();

    const { getByRole, store } = render({
      ...getProps(),
      onHide: onHide,
      onSelect: onSelect
    }, {
      preloadedState: {
        panel: {
          ...initialPanelState(),
          show: true
        }
      },
      context: {
        ...context,
        map
      }
    });

    fireEvent.click(getByRole("button", { name: "Select location" }));

    expect(onHide).toHaveBeenCalled();
    expect(captureLocation).toHaveBeenCalled();
    expect(store.getState().panel.show).toBeFalsy();

    captureLocation.mock.calls[0][0]({ lon: 0, lat: 0 });

    expect(onSelect).toHaveBeenCalled();
    expect(store.getState().panel.show).toBeTruthy();
  });

  test("select enforces the workflow", () => {
    const onHide = jest.fn();
    const onSelect = jest.fn();

    const { getByRole } = render({
      ...getProps(),
      onHide,
      onSelect
    }, {
      preloadedState: {
        favorites: {
          ...initialFavoritesState(),
          places: [["A", "1"], ["B", "2"], ["C", "3"]].map(([name, placeId]) => ({
            ...getPlace(),
            name: `Place ${name}`,
            placeId
          }))
        }
      }
    });

    fireEvent.click(getByRole("button", { name: "Open" }));
    fireEvent.click(getByRole("option", { name: "Place B" }));
    fireEvent.click(getByRole("button", { name: "Confirm" }));

    expect(onHide).toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalled();
  });
});
