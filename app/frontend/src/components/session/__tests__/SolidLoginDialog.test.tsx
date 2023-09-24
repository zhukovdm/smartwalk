import { act, fireEvent, waitFor } from "@testing-library/react";
import * as solid from "../../../utils/solidProvider";
import { AppRenderOptions, renderWithProviders } from "../../../utils/testUtils";
import SolidLoginDialog, {
  type SolidLoginDialogProps
} from "../SolidLoginDialog";

const getProps = (): SolidLoginDialogProps => ({
  show: true,
  onHide: jest.fn()
})

function render(props = getProps(), options: AppRenderOptions = {}) {
  return renderWithProviders(<SolidLoginDialog {...props} />, options);
}

describe("<SolidLoginDialog />", () => {

  test("render", () => {
    expect(render().getByRole("dialog", { name: "Solid session" })).toBeTruthy();
  });

  it("should allow the user to select url", () => {
    const { getByRole, queryAllByRole } = render();
    fireEvent.keyDown(getByRole("combobox", { name: "Url" }), { key: "ArrowDown" });
    expect(queryAllByRole("option")).toHaveLength(4);
  });

  it("should disable login button if provided string is an invalid url, and enable otherwise", () => {
    const { getByRole } = render();

    fireEvent.change(getByRole("combobox", { name: "Url" }), { target: { value: "https://@" } });
    expect(getByRole("button", { name: "Log in" })).toBeDisabled();

    fireEvent.change(getByRole("combobox", { name: "Url" }), { target: { value: "https://a" } });
    expect(getByRole("button", { name: "Log in" })).toBeEnabled();
  });

  it("should call login and disable dialog modifications", async () => {
    const loginSpy = jest.spyOn(solid, "loginSolid").mockImplementation();

    const { getByRole } = render();

    fireEvent.change(getByRole("combobox", { name: "Url" }), { target: { value: "https://www.example.com" } });

    act(() => {
      fireEvent.click(getByRole("button", { name: "Log in" }));
    });

    await waitFor(() => {
      expect(getByRole("combobox", { name: "Url" })).toBeDisabled();
      expect(getByRole("button", { name: "Discard" })).toBeDisabled();
      expect(getByRole("button", { name: "Log in" })).toBeDisabled();
      expect(loginSpy).toHaveBeenCalled();
    });
  })
});
