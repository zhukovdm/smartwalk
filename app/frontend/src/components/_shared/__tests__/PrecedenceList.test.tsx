import { render as rtlRender } from "@testing-library/react";
import PrecedenceList, {
  type PrecedenceListProps
} from "../PrecedenceList";

const getProps = (): PrecedenceListProps => ({
  precedence: [
    { fr: 0, to: 1 },
    { fr: 1, to: 2 }
  ]
});

function render(props = getProps()) {
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
