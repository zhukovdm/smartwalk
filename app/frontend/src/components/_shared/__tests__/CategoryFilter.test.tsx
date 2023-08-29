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

  test("active checkbox has proper label and title", () => {
    const text = "Hide (1: museum) items";
    const { getByRole, getByLabelText } = render();
    expect(getByLabelText(text)).toBeInTheDocument();
    expect(getByRole("checkbox", { name: text })).toBeInTheDocument();
  });

  test("inactive checkbox has proper label and title", () => {
    const text = "Show (1: museum) items";
    const { getByRole, getByLabelText } = render({ active: false });
    expect(getByLabelText(text)).toBeInTheDocument();
    expect(getByRole("checkbox", { name: text })).toBeInTheDocument();
  });

  test("toggle callback gets called", () => {
    const onToggle = jest.fn();
    const { getByRole } = render({ onToggle: onToggle });
    fireEvent.click(getByRole("checkbox", { name: "Hide (1: museum) items" }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  test("filter button has proper label and title", () => {
    const { getByRole, getByText } = render();
    expect(getByRole("button", { name: "Show (1: museum) filters" })).toBeInTheDocument();
    expect(getByText("1: museum")).toBeInTheDocument();
  });

  test("filter button opens dialog upon click", () => {
    const { getByRole, queryAllByRole } = render();
    expect(queryAllByRole("dialog").length).toEqual(0);
    fireEvent.click(getByRole("button"));
    expect(getByRole("dialog")).toBeInTheDocument();
  });

  test("filter button opens dialog upon Enter", () => {
    const { getByRole, queryAllByRole } = render();
    expect(queryAllByRole("dialog").length).toEqual(0);
    fireEvent.keyDown(getByRole("button"), { key: "Enter" });
    expect(getByRole("dialog")).toBeInTheDocument();
  });

  test("filter button opens dialog upon Space", () => {
    const { getByRole, queryAllByRole } = render();
    expect(queryAllByRole("dialog").length).toEqual(0);
    fireEvent.keyDown(getByRole("button"), { key: " " });
    expect(getByRole("dialog")).toBeInTheDocument();
  });
});
