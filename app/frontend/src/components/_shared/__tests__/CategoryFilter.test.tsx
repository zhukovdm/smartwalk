import {
  RenderResult,
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import CategoryFilter from "../CategoryFilter";

type CategoryFilterProps = {
  active?: boolean;
  found?: boolean;
  index?: number;
  onToggle?: () => void;
};

function render(
  {
    active = true, found = true, index = 0, onToggle = () => { }
  }: CategoryFilterProps = {}
): RenderResult {
  return rtlRender(
    <CategoryFilter
      active={active}
      found={found}
      index={index}
      category={
        {
          keyword: "museum",
          filters: {}
        }
      }
      onToggle={onToggle}
    />
  );
}

describe("<CategoryFilter />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("filter role and name", () => {
    const { getByRole } = render();
    expect(getByRole("listitem", { name: "1: museum" })).toBeInTheDocument();
  });

  describe("checkbox", () => {

    test("active role and name", () => {
      const { getByRole } = render();
      expect(getByRole("checkbox", { name: "Hide places" })).toBeInTheDocument();
    });

    test("inactive role and name", () => {
      const { getByRole } = render({ active: false });
      expect(getByRole("checkbox", { name: "Show places" })).toBeInTheDocument();
    });

    describe("onToggle", () => {

      test("gets called upon Click", () => {
        const fn = jest.fn();
        const { getByRole } = render({ onToggle: fn });
        fireEvent.click(getByRole("checkbox"));
        expect(fn).toHaveBeenCalledTimes(1);
      });

      test("gets called upon Space", () => {
        const fn = jest.fn();
        const { getByRole } = render({ onToggle: fn });
        fireEvent.keyDown(getByRole("checkbox"), { key: " " });
        expect(fn).toHaveBeenCalledTimes(1);
      });

      test("does not get called upon Enter", () => {
        const fn = jest.fn();
        const { getByRole } = render({ onToggle: fn });
        fireEvent.keyDown(getByRole("checkbox"), { key: "Enter" });
        expect(fn).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe("filter button", () => {

    test("role and name", () => {
      const { getByRole } = render();
      expect(getByRole("button", { name: "Show filters" })).toBeInTheDocument();
    });

    test("opens dialog upon Click", () => {
      const { getByRole, queryAllByRole } = render();
      expect(queryAllByRole("dialog").length).toEqual(0);
      fireEvent.click(getByRole("button"));
      expect(getByRole("dialog")).toBeInTheDocument();
    });

    test("opens dialog upon Enter", () => {
      const { getByRole, queryAllByRole } = render();
      expect(queryAllByRole("dialog").length).toEqual(0);
      fireEvent.keyDown(getByRole("button"), { key: "Enter" });
      expect(getByRole("dialog")).toBeInTheDocument();
    });

    test("opens dialog upon Space", () => {
      const { getByRole, queryAllByRole } = render();
      expect(queryAllByRole("dialog").length).toEqual(0);
      fireEvent.keyDown(getByRole("button"), { key: " " });
      expect(getByRole("dialog")).toBeInTheDocument();
    });
  });
});
