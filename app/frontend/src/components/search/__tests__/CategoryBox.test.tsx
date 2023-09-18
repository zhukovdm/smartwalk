import { getKeywordAdviceItem } from "../../../utils/testData";
import { AppRenderOptions, renderWithProviders } from "../../../utils/testUtils";
import CategoryBox, { type CategoryBoxProps } from "../CategoryBox";

const getProps = (): CategoryBoxProps => ({
  categories: Array(5).fill(undefined).map(() => ({
    ...getKeywordAdviceItem(),
    filters: {}
  })),
  onAppend: jest.fn(),
  onDelete: jest.fn(),
  onUpdate: jest.fn()
});

function render(props = getProps(), options: AppRenderOptions = {}) {
  return renderWithProviders(<CategoryBox {...props} />, options);
}

describe("<CategoryBox />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  it("should render list, chips, and button", () => {
    const { getByRole } = render();

    expect(getByRole("list", { name: "Categories" })).toBeInTheDocument();
    for (let i = 1; i <= 5; ++i) {
      expect(getByRole("button", { name: `${i}: Keyword A` })).toBeInTheDocument();
    }
    expect(getByRole("button", { name: "Add category" })).toBeInTheDocument();
  });
});
