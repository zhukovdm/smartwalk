import { act, fireEvent, waitFor } from "@testing-library/react";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../utils/testUtils";
import SessionProvider from "../SessionProvider";

function render(options: AppRenderOptions = {}) {
  return renderWithProviders(<SessionProvider />, options);
}

describe("<SessionProvider />", () => {
  
  test("render", () => {
    expect(render().container).toBeTruthy();
  });

  describe("solid", () => {

    it("should not close dialog upon Escape, but upon Discard", async () => {
      const { getByRole, queryByRole } = render();

      fireEvent.click(getByRole("button", { name: "Log in" }));
      fireEvent.click(getByRole("menuitem", { name: "Solid" }));

      act(() => {
        fireEvent.keyDown(getByRole("dialog"), { key: "Escape" });
      });
      await waitFor(() => {
        expect(getByRole("dialog")).toBeInTheDocument();
      });

      act(() => {
        fireEvent.click(getByRole("button", { name: "Discard" }));
      });
      await waitFor(() => {
        expect(queryByRole("dialog")).toBeInTheDocument();
      });
    });

    it("should discard an entered url if the dialog has been closed", async () => {
      const { getByRole, queryByRole } = render();

      fireEvent.click(getByRole("button", { name: "Log in" }));
      fireEvent.click(getByRole("menuitem", { name: "Solid" }));

      fireEvent.change(getByRole("combobox", { name: "Url" }), { target: { value: "https://www.example.com" } });
      act(() => {
        fireEvent.click(getByRole("button", { name: "Discard" }));
      });
      await waitFor(() => {
        expect(queryByRole("dialog")).not.toBeInTheDocument();
      });

      fireEvent.click(getByRole("button", { name: "Log in" }));
      fireEvent.click(getByRole("menuitem", { name: "Solid" }));

      expect(getByRole("combobox", { name: "Url" })).toHaveValue("https://");
    });
  });
});
