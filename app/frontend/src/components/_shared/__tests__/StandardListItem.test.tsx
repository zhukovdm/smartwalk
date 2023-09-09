import { render as rtlRender } from "@testing-library/react";
import { withRouter } from "../../../utils/testUtils";
import StandardListItem, {
  type StandardListItemProps
} from "../StandardListItem";

const getDefault = (): StandardListItemProps => ({
  link: "/entity/place/1",
  label: "Place",
  l: <></>,
  r: <></>
});

function render(props = getDefault()) {
  return rtlRender(withRouter(<StandardListItem {...props} />));
};

describe("<StandardListItem />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });
});
