import { fireEvent, waitFor, within } from "@testing-library/react";
import { LeafletMap } from "../../../utils/leaflet";
import { getPlace } from "../../../utils/testData";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import SourceTargetBox, { type SourceTargetBoxProps } from "../SourceTargetBox"

const getProps = (): SourceTargetBoxProps => ({
  source: {
    ...getPlace(),
    name: "Source"
  },
  target: {
    ...getPlace(),
    name: "Target"
  }
});

function render(props = getProps(), options: AppRenderOptions = {}) {
  return renderWithProviders(<SourceTargetBox {...props} />, options);
}

describe("<SourceTargetBox />", () => {

  test("render", () => {
    expect(render().container).toBeTruthy();
  });

  describe("source dialog", () => {

    it("should open upon clicking on Select", () => {
      const { getByRole } = render({});
      fireEvent.click(getByRole("button", { name: "Select starting point" }));
      expect(getByRole("dialog", { name: "Select point" })).toBeInTheDocument();
    });

    it("should open upon clicking on Label", () => {
      const { getByRole, getByText } = render({});
      fireEvent.click(getByText("Select starting point..."));
      expect(getByRole("dialog", { name: "Select point" })).toBeInTheDocument();
    });

    it("should close upon Cross", async () => {
      const { getByRole, queryByRole } = render({});

      fireEvent.click(getByRole("button", { name: "Select starting point" }));
      fireEvent.click(getByRole("button", { name: "Hide dialog" }));

      await waitFor(() => {
        expect(queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("should close upon Escape", async () => {
      const { getByRole, queryByRole } = render({});

      fireEvent.click(getByRole("button", { name: "Select starting point" }));
      fireEvent.keyDown(getByRole("dialog", { name: "Select point" }), { key: "Escape" });

      await waitFor(() => {
        expect(queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  });

  describe("target dialog", () => {

    it("should open upon clicking on Select", () => {
      const { getByRole } = render({});
      fireEvent.click(getByRole("button", { name: "Select destination" }));
      expect(getByRole("dialog", { name: "Select point" })).toBeInTheDocument();
    });

    it("should open upon clicking on Label", () => {
      const { getByRole, getByText } = render({});
      fireEvent.click(getByText("Select destination..."));
      expect(getByRole("dialog", { name: "Select point" })).toBeInTheDocument();
    });

    it("should close upon Cross", async () => {
      const { getByRole, queryByRole } = render({});

      fireEvent.click(getByRole("button", { name: "Select destination" }));
      fireEvent.click(getByRole("button", { name: "Hide dialog" }));

      await waitFor(() => {
        expect(queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("should close upon Escape", async () => {
      const { getByRole, queryByRole } = render({});

      fireEvent.click(getByRole("button", { name: "Select destination" }));
      fireEvent.keyDown(getByRole("dialog", { name: "Select point" }), { key: "Escape" });

      await waitFor(() => {
        expect(queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  });

  describe("source", () => {

    test("flies to the point upon clicking", () => {
      const map = new LeafletMap();
      const flyTo = jest.spyOn(map, "flyTo");

      const { getByRole } = render({
        ...getProps(),
        map
      });

      fireEvent.click(within(getByRole("region", { name: "Starting point" }))
        .getByRole("button", { name: "Fly to" }));

      expect(flyTo).toHaveBeenCalledWith(getProps().source);
    });
  });

  describe("target", () => {

    test("flies to the point upon clicking", () => {
      const map = new LeafletMap();
      const flyTo = jest.spyOn(map, "flyTo");

      const { getByRole } = render({
        ...getProps(),
        map
      });

      fireEvent.click(within(getByRole("region", { name: "Destination" }))
        .getByRole("button", { name: "Fly to" }));

      expect(flyTo).toHaveBeenCalledWith(getProps().target);
    });
  });
});
