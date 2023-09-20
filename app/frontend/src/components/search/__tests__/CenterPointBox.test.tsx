import { fireEvent, waitFor } from "@testing-library/react";
import { getPlace } from "../../../utils/testData";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import { LeafletMap } from "../../../utils/leaflet";
import CenterPointBox, { type CenterPointBoxProps } from "../CenterPointBox";

const getProps = (): CenterPointBoxProps => ({});

function render(props = getProps(), options: AppRenderOptions = {}) {
  return renderWithProviders(<CenterPointBox {...props} />, options);
}

describe("<CenterPointBox />", () => {

  test("render", () => {
    expect(render().container).toBeTruthy();
  });

  describe("center dialog", () => {

    it("should open upon clicking on Select", () => {
      const { getByRole } = render();
      fireEvent.click(getByRole("button", { name: "Select center point" }));
      expect(getByRole("dialog", { name: "Select point" })).toBeInTheDocument();
    });

    it("should open upon clicking on Label", () => {
      const { getByRole, getByText } = render();
      fireEvent.click(getByText("Select center point..."));
      expect(getByRole("dialog", { name: "Select point" })).toBeInTheDocument();
    });

    it("should close upon Cross", async () => {
      const { getByRole, queryByRole } = render();

      fireEvent.click(getByRole("button", { name: "Select center point" }));
      fireEvent.click(getByRole("button", { name: "Hide dialog" }));

      await waitFor(() => {
        expect(queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("should close upon Escape", async () => {
      const { getByRole, queryByRole } = render();

      fireEvent.click(getByRole("button", { name: "Select center point" }));
      fireEvent.keyDown(getByRole("dialog", { name: "Select point" }), { key: "Escape" });

      await waitFor(() => {
        expect(queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  });

  describe("center", () => {

    test("flies to the point upon clicking", () => {
      const map = new LeafletMap();
      const flyTo = jest.spyOn(map, "flyTo");

      const { getByRole } = render({
        center: {
          ...getPlace(),
          name: "Place A"
        },
        map
      });

      fireEvent.click(getByRole("button", { name: "Fly to" }));
      expect(flyTo).toHaveBeenCalled();
    });
  });
});
