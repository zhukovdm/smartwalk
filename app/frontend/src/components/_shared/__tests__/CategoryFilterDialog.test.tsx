import {
  RenderResult,
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import CategoryFilterDialog from "../CategoryFilterDialog";

const getCategory = () => ({
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
});

const onHide = jest.fn();

function render(): RenderResult {
  return rtlRender(
    <CategoryFilterDialog
      show
      category={getCategory()}
      onHide={onHide}
    />
  );
}

describe("<CategoryFilterDialog />", () => {

  test("hide button triggers onHide", () => {
    const { getByRole } = render();
    fireEvent.click(getByRole("button", { name: "Hide dialog" }));
    expect(onHide).toBeCalledTimes(1);
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
