import { fireEvent } from "@testing-library/react";
import { getKeywordAdviceItem } from "../../../utils/testData";
import { AppRenderOptions, renderWithProviders } from "../../../utils/testUtils";
import CategoryChip, { type CategoryChipProps } from "../CategoryChip";

global.alert = jest.fn();
global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

const getProps = (): CategoryChipProps => ({
  category: {
    ...getKeywordAdviceItem(),
    filters: {}
  },
  index: 0,
  onDelete: jest.fn(),
  onUpdate: jest.fn()
});

function render(props = getProps(), options: AppRenderOptions = {}) {
  return renderWithProviders(<CategoryChip {...props} />, options)
}

describe("<CategoryChip />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("dialog is hiden at the beginning", () => {
    const { queryByRole } = render();
    expect(queryByRole("dialog")).not.toBeInTheDocument();
  })

  test("dialog appears and hides upon Enter (or click)", async () => {

    const { getByRole, queryByRole } = render();

    fireEvent.keyDown(getByRole("button", { name: "1: Keyword A" }), { key: "Enter" });
    expect(getByRole("dialog", { name: "Modify category" })).toBeInTheDocument();

    fireEvent.click(getByRole("button", { name: "Discard" }));

    // not necessary to wait because of the immediate unmount
    expect(queryByRole("dialog", { name: "Modify category" })).not.toBeInTheDocument();
  });

  test("chip attemts to remove itself upon Delete (or cross)", () => {

    const onDelete = jest.fn();
    const { getByRole } = render({
      ...getProps(),
      onDelete: onDelete
    });

    /*
     * Note that proper delete event is `keyUp` and not `keyDown`.
     */

    fireEvent.keyUp(getByRole("button", { name: "1: Keyword A" }), { key: "Delete" });
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  test("dialog is rendered with predefined category", () => {
    const { getByRole } = render();
    fireEvent.click(getByRole("button", { name: "1: Keyword A" }));

    expect(getByRole("button", { name: "Have" }));
    expect(getByRole("combobox", { name: "Keyword" })).toHaveProperty("disabled");
  });
});
