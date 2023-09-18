import { fireEvent } from "@testing-library/react";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import CategoryButton, { type CategoryButtonProps } from "../CategoryButton"

global.alert = jest.fn();
global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

const getProps = (): CategoryButtonProps => ({
  onAppend: jest.fn()
});

function render(props = getProps(), options: AppRenderOptions = {}) {
  return renderWithProviders(<CategoryButton {...props} />, options);
}

describe("<CategoryButton />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("dialog appears and hides", async () => {
    const { getByRole, queryByRole } = render();
    expect(queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(getByRole("button", { name: "Add category" }));
    expect(getByRole("dialog", { name: "Add category" })).toBeInTheDocument();


    fireEvent.click(getByRole("button", { name: "Discard" }));

    // not necessary to wait because of the immediate unmount
    expect(queryByRole("dialog", { name: "Add category" })).not.toBeInTheDocument();
  });

  test("dialog is rendered without predefined category", () => {
    const { getByRole } = render();
    fireEvent.click(getByRole("button", { name: "Add category" }));
    expect(getByRole("alert"));
  });
});
