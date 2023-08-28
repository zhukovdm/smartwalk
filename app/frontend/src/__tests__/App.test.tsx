import {
  cleanup,
  fireEvent,
  render,
  waitFor
} from "@testing-library/react";
import App from "../App";

jest.spyOn(window, "alert").mockImplementation(() => { });

describe("<App />", () => {

  beforeEach(cleanup);

  it("basic render", () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it("should render control buttons", () => {
    const { getByRole } = render(<App />);
    [
      "Show panel",
      "Hide panel",
      "Log in"
    ].forEach((name) => {
      expect(getByRole("button", { name: name })).toBeInTheDocument();
    });
  });

  it("should render leaflet buttons", () => {
    const { getByRole } = render(<App />);
    [
      "Show me where I am",
      "Zoom in",
      "Zoom out"
    ].forEach((name) => {
      expect(getByRole("button", { name: name })).toBeInTheDocument();
    });
  });

  test("hide button hides, show button shows", async () => {
    const { getByRole, getByLabelText } = render(<App />);

    fireEvent.click(getByRole("button", { name: "Hide panel" }));
    await waitFor(() => (
      expect(getByLabelText("Search routes")).not.toBeVisible()
    ));

    fireEvent.click(getByRole("button", { name: "Show panel" }));
    expect(getByLabelText("Search routes")).toBeVisible();
  });
});
