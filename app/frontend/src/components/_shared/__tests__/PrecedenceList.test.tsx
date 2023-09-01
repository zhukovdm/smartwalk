import {
  render as rtlRender
} from "@testing-library/react";
import PrecedenceList, { PrecedenceListProps } from "../PrecedenceList";

const getDefault = (): PrecedenceListProps => ({
  precedence: [
    {
      fr: 0,
      to: 1
    },
    {
      fr: 1,
      to: 2
    }
  ]
});

function render(props = getDefault()) {
  return rtlRender(<PrecedenceList {...props} />);
}

describe("<PrecedenceList />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("role and name", () => {
    const { getByRole } = render();
    expect(getByRole("list", { name: "Arrows" })).toBeInTheDocument();
  });

  test("item generation", () => {
    const { getAllByRole } = render();
    expect(getAllByRole("listitem").length).toEqual(2);
  });
});
