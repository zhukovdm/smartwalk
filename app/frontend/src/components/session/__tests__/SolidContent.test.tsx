import { act, fireEvent, waitFor } from "@testing-library/react";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import * as solid from "../../../utils/solidProvider";
import SolidContent from "../SolidContent";

global.alert = jest.fn();

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate
}));

jest.mock("../../../utils/solidStorage");

type T = ReturnType<typeof renderWithProviders>;

function render(options: AppRenderOptions = {}) {
  return renderWithProviders(<SolidContent />, options);
}

describe("<SolidContent />", () => {

  test("render", async () => {
    let renderOption: T;

    jest.spyOn(solid, "getAvailableSolidPods").mockResolvedValueOnce(["1", "2", "3"].map((id) => (
      `http://www.storage.com/${id}`
    )));

    act(() => {
      renderOption = render();
    });
    await waitFor(() => {
      expect(renderOption.container).toBeTruthy();
    });
  });

  it("should enable activation button if some PodId is selected, and disable otherwise", async () => {

    let renderOption: T;

    jest.spyOn(solid, "getAvailableSolidPods").mockResolvedValueOnce(["1", "2", "3"].map((id) => (
      `https://www.storage.com/${id}`
    )));

    act(() => {
      renderOption = render();
    });
    await waitFor(() => {
      expect(renderOption.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    const { getByRole, getByLabelText } = renderOption!;

    expect(getByRole("button", { name: "Activate" })).toBeDisabled();

    fireEvent.click(getByRole("button", { name: "Open" }));
    fireEvent.click(getByRole("option", { name: "https://www.storage.com/2" }));

    expect(getByRole("button", { name: "Activate" })).toBeEnabled();

    fireEvent.click(getByLabelText("Clear"));

    expect(getByRole("button", { name: "Activate" })).toBeDisabled();
  });

  it("should allow the user to activate selected pod", async () => {

    let renderOption: T;

    jest.spyOn(solid, "getAvailableSolidPods").mockResolvedValueOnce(["1", "2", "3"].map((id) => (
      `https://www.storage.com/${id}`
    )));

    act(() => {
      renderOption = render();
    });

    await waitFor(() => {
      expect(renderOption.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    const { getByRole } = renderOption!;

    fireEvent.click(getByRole("button", { name: "Open" }));
    fireEvent.click(getByRole("option", { name: "https://www.storage.com/2" }));

    expect(getByRole("button", { name: "Activate" })).toBeEnabled();

    act(() => {
      fireEvent.click(getByRole("button", { name: "Activate" }));
    });

    await waitFor(() => {
      expect(mockUseNavigate).toHaveBeenCalledWith("/favorites");
    });
  });
});
