import {
  act,
  fireEvent,
  render as rtlRender,
  waitFor,
  within
} from "@testing-library/react";
import {
  getAttributeFilters,
  getKeywordAdviceItem
} from "../../../utils/testData";
import AttributeFiltersList, {
  type AttributeFiltersListProps
} from "../AttributeFiltersList";

const getProps = (): AttributeFiltersListProps => ({
  adviceItem: getKeywordAdviceItem(),
  filters: getAttributeFilters(),
  onExistenUpdate: jest.fn(),
  onBooleanUpdate: jest.fn(),
  onNumericUpdate: jest.fn(),
  onTextualUpdate: jest.fn(),
  onCollectUpdate: jest.fn(),
});

function render(props = getProps()) {
  return rtlRender(<AttributeFiltersList {...props} />);
}

describe("<AttributeFiltersList />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  describe("region control", () => {
    const names = ["Have", "Yes / No", "Numeric", "Contain text", "Include any / Exclude all"]

    it("should contain buttons and regions", () => {
      const { getByRole } = render();
      names.forEach((name) => {
        expect(getByRole("region", { name })).toBeInTheDocument();
        expect(getByRole("button", { name })).toBeInTheDocument();
      });
    });

    it("should not render regions if attribute list is empty", () => {
      const { queryByRole } = render({
        ...getProps(),
        adviceItem: {
          keyword: "keyword",
          attributeList: [],
          numericBounds: {},
          collectBounds: {}
        },
      });
      names.forEach((name) => {
        expect(queryByRole("button", { name })).not.toBeInTheDocument();
        expect(queryByRole("region", { name })).not.toBeInTheDocument();
      });
    });
  });

  /**
   * Note that collapse/expand tests are almost identical, but together can
   * easily hit default timeout of 5000ms.
   */

  describe("es region", () => {

    it("should collapse and expand region", async () => {
      const obj = { name: "Have" };

      const { getByRole, queryByRole } = render();

      act(() => {
        fireEvent.click(getByRole("button", obj));
      });
      await waitFor(() => {
        expect(queryByRole("region", obj)).not.toBeInTheDocument();
      });
      act(() => {
        fireEvent.click(getByRole("button", obj));
      });
      await waitFor(() => {
        expect(getByRole("region", obj)).toBeInTheDocument();
      });
    });

    it("should render checked item", () => {
      const { getByRole } = render();
      const region = getByRole("region", { name: "Have" });
      expect(within(region).getByText("website")).toBeInTheDocument();
      expect(within(region).getByRole("checkbox", { name: "website" })).toHaveProperty("checked", true);
    });

    it("should pass callback", () => {
      const onExistenUpdate = jest.fn();
      const { getByRole } = render({
        ...getProps(),
        onExistenUpdate: onExistenUpdate
      });
      fireEvent.click(within(getByRole("region", { name: "Have" }))
        .getByRole("checkbox", { name: "website" }));
      expect(onExistenUpdate).toHaveBeenCalledWith("website", undefined);
    });
  });

  describe("bs region", () => {

    it("should collapse and expand region", async () => {
      const obj = { name: "Yes / No" };

      const { getByRole, queryByRole } = render();

      act(() => {
        fireEvent.click(getByRole("button", obj));
      });
      await waitFor(() => {
        expect(queryByRole("region", obj)).not.toBeInTheDocument();
      });
      act(() => {
        fireEvent.click(getByRole("button", obj));
      });
      await waitFor(() => {
        expect(getByRole("region", obj)).toBeInTheDocument();
      });
    });

    it("should render checked item", () => {
      const { getByRole } = render();
      const region = getByRole("region", { name: "Yes / No" });
      expect(within(region).getByText("delivery")).toBeInTheDocument();
      expect(within(region).getByRole("radio", { name: "Yes" })).toHaveProperty("checked", false);
      expect(within(region).getByRole("radio", { name: "No" })).toHaveProperty("checked", true);
    });

    it("should pass callback", () => {
      const onBooleanUpdate = jest.fn();
      const { getByRole } = render({
        ...getProps(),
        onBooleanUpdate: onBooleanUpdate
      });
      fireEvent.click(within(getByRole("region", { name: "Yes / No" }))
        .getByRole("checkbox", { name: "delivery" }));
      expect(onBooleanUpdate).toHaveBeenCalledWith("delivery", undefined);
    });
  });

  describe("ns region", () => {

    it("should collapse and expand region", async () => {
      const obj = { name: "Numeric" };

      const { getByRole, queryByRole } = render();

      act(() => {
        fireEvent.click(getByRole("button", obj));
      });
      await waitFor(() => {
        expect(queryByRole("region", obj)).not.toBeInTheDocument();
      });
      act(() => {
        fireEvent.click(getByRole("button", obj));
      });
      await waitFor(() => {
        expect(getByRole("region", obj)).toBeInTheDocument();
      });
    });

    it("should render checked item", () => {
      const { getByRole } = render();
      const region = getByRole("region", { name: "Numeric" });
      expect(within(region).getByText("capacity between 20 and 80")).toBeInTheDocument();
      expect(within(region).getByRole("slider", { name: "Lower bound" })).toHaveValue("20");
      expect(within(region).getByRole("slider", { name: "Upper bound" })).toHaveValue("80");
    });

    it("should pass callback", () => {
      const onNumericUpdate = jest.fn();
      const { getByRole } = render({
        ...getProps(),
        onNumericUpdate: onNumericUpdate
      });
      fireEvent.click(within(getByRole("region", { name: "Numeric" }))
        .getByRole("checkbox", { name: "capacity between 20 and 80" }));
      expect(onNumericUpdate).toHaveBeenCalledWith("capacity", undefined);
    });
  });

  describe("ts region", () => {

    it("should collapse and expand region", async () => {
      const obj = { name: "Contain text" };

      const { getByRole, queryByRole } = render();

      act(() => {
        fireEvent.click(getByRole("button", obj));
      });
      await waitFor(() => {
        expect(queryByRole("region", obj)).not.toBeInTheDocument();
      });
      act(() => {
        fireEvent.click(getByRole("button", obj));
      });
      await waitFor(() => {
        expect(getByRole("region", obj)).toBeInTheDocument();
      });
    });

    it("should render checked item", () => {
      const { getByRole } = render();
      const region = getByRole("region", { name: "Contain text" });
      expect(within(region).getByText("name")).toBeInTheDocument();
      expect(within(region).getByRole("textbox", { name: "Text" })).toHaveValue("Abc");
    });

    it("should pass callback", () => {
      const onTextualUpdate = jest.fn();
      const { getByRole } = render({
        ...getProps(),
        onTextualUpdate: onTextualUpdate
      });
      fireEvent.click(within(getByRole("region", { name: "Contain text" }))
        .getByRole("checkbox", { name: "name" }));
      expect(onTextualUpdate).toHaveBeenCalledWith("name", undefined);
    });
  });

  describe("cs region", () => {

    it("should collapse and expand region", async () => {
      const obj = { name: "Include any / Exclude all" };

      const { getByRole, queryByRole } = render();

      act(() => {
        fireEvent.click(getByRole("button", obj));
      });
      await waitFor(() => {
        expect(queryByRole("region", obj)).not.toBeInTheDocument();
      });
      act(() => {
        fireEvent.click(getByRole("button", obj));
      });
      await waitFor(() => {
        expect(getByRole("region", obj)).toBeInTheDocument();
      });
    });

    it("should render checked item", () => {
      const { getByRole } = render();
      const region = getByRole("region", { name: "Include any / Exclude all" });
      expect(within(region).getByText("cuisine")).toBeInTheDocument();
      expect(within(region).getByRole("button", { name: "a" })).toBeInTheDocument();
      expect(within(region).getByRole("button", { name: "b" })).toBeInTheDocument();
    });

    it("should pass callback", () => {
      const onCollectUpdate = jest.fn();
      const { getByRole } = render({
        ...getProps(),
        onCollectUpdate: onCollectUpdate
      });
      fireEvent.click(within(getByRole("region", { name: "Include any / Exclude all" }))
        .getByRole("checkbox", { name: "cuisine" }));
      expect(onCollectUpdate).toHaveBeenCalledWith("cuisine", undefined);
    });
  });
});
