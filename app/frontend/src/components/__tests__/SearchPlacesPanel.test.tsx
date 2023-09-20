import { fireEvent, waitFor } from "@testing-library/react";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import SearchPlacesPanel from "../SearchPlacesPanel";
import { LeafletMap } from "../../utils/leaflet";

const getProps = (): {} => ({});

function render(props = getProps(), options: AppRenderOptions = {}) {
  return renderWithProviders(<SearchPlacesPanel {...props} />, options);
}

describe("<SearchPlacesPanel />", () => {

  test("render", () => {
    expect(render().container).toBeTruthy();
  });

  describe("center", () => {

    test("add user-defined point", async () => {

      const map = new LeafletMap();
      const captureLocation = jest.spyOn(map, "captureLocation").mockImplementation();

      const { getByRole } = render();
      fireEvent.click(getByRole("button", { name: "Select center point" }));
      fireEvent.click(getByRole("button", { name: "Select location" }));
    });

    test("|", () => {

    });

    test("|", () => {

    });

    test("|", () => {

    });

    test("|", () => {

    });
  });
});
