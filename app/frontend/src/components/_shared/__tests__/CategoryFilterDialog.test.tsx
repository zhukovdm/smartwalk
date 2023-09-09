import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import CategoryFilterDialog, {
  type CategoryFilterDialogProps
} from "../CategoryFilterDialog";

const getProps = (): CategoryFilterDialogProps => ({
  show: true,
  category: {
    keyword: "museum",
    filters: {
      es: {
        openingHours: {}
      },
      bs: {
        internetAccess: true
      },
      ns: {
        minimumAge: { min: 0, max: 21 }
      },
      ts: {
        name: "old"
      },
      cs: {
        payment: {
          inc: ["cash"],
          exc: ["card"]
        }
      }
    }
  },
  onHide: jest.fn()
})

function render(props = getProps()) {
  return rtlRender(<CategoryFilterDialog {...props} />);
}

describe("<CategoryFilterDialog />", () => {

  test("hide button triggers onHide", () => {
    const onHide = jest.fn();
    const { getByRole } = render({
      ...getProps(),
      onHide: onHide
    });
    fireEvent.click(getByRole("button", { name: "Hide dialog" }));
    expect(onHide).toHaveBeenCalledTimes(1);
  });

  it("should show eS attributes", () => {
    const { getByText } = render();
    expect(getByText("opening hours")).toBeInTheDocument();
  });

  it("should show bS attributes", () => {
    const { getByText } = render();
    expect(getByText("internet access == yes")).toBeInTheDocument();
  });

  it("should show nS attributes", () => {
    const { getByText } = render();
    expect(getByText("0 ≤ minimum age ≤ 21")).toBeInTheDocument();
  });

  it("should show tS attributes", () => {
    const { getByText } = render();
    expect(getByText("old ∈ name")).toBeInTheDocument();
  });

  it("should show cS attributes", () => {
    const { getByText } = render();
    ["payment", "cash", "card"].forEach((item) => {
      expect(getByText(item)).toBeInTheDocument();
    });
  });
});
