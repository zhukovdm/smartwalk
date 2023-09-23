import {
  type AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import * as L from "../../utils/leaflet";
import MapControl from "../MapControl";
import { waitFor } from "@testing-library/react";

function render(options: AppRenderOptions = {}) {
  return renderWithProviders(<MapControl />, options);
}

describe("<MapControl />", () => {

  test("render", () => {
    expect(render().container).toBeTruthy();
  });

  it("should extract actual map", async () => {

    const spy = jest.spyOn(L, "LeafletMap").mockImplementation();
    const { } = render();

    await waitFor(() => {
      const len = spy.mock.calls.length;
      expect(spy.mock.calls[len - 1][0]).toBeTruthy();
    });
  });
});
