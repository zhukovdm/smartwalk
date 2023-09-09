import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import CategoryFilter, {
  type CategoryFilterProps
} from "../CategoryFilter";

const getDefault = (): CategoryFilterProps => ({
  active: true,
  found: true,
  index: 0,
  category: {
    keyword: "museum",
    filters: {}
  },
  onToggle: jest.fn()
})

function render(props = getDefault()) {
  return rtlRender(<CategoryFilter {...props} />);
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
      const { getByRole } = render({
        ...getDefault(),
        active: false
      });
      expect(getByRole("checkbox", { name: "Show places" })).toBeInTheDocument();
    });

    describe("onToggle", () => {

      test("gets called upon Click", () => {
        const onToggle = jest.fn();
        const { getByRole } = render({
          ...getDefault(),
          onToggle: onToggle
        });
        fireEvent.click(getByRole("checkbox"));
        expect(onToggle).toHaveBeenCalledTimes(1);
      });

      test("gets called upon Space", () => {
        const onToggle = jest.fn();
        const { getByRole } = render({
          ...getDefault(),
          onToggle: onToggle
        });
        fireEvent.keyDown(getByRole("checkbox"), { key: " " });
        expect(onToggle).toHaveBeenCalledTimes(1);
      });

      test("does not get called upon Enter", () => {
        const onToggle = jest.fn();
        const { getByRole } = render({
          ...getDefault(),
          onToggle: onToggle
        });
        fireEvent.keyDown(getByRole("checkbox"), { key: "Enter" });
        expect(onToggle).toHaveBeenCalledTimes(0);
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
