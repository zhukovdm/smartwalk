import {
  type RenderResult,
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import { withRouter } from "../../../utils/testUtils";
import InformPlaceListItem, {
  type InformPlaceListItemProps
} from "../InformPlaceListItem";

const getDefault = (): InformPlaceListItemProps => ({
  place: {
    smartId: "1",
    name: "Place",
    location: {
      lon: 0.0,
      lat: 0.0
    },
    keywords: [],
    categories: []
  },
  kind: "common",
  title: "Fly to",
  onPlace: jest.fn()
});

function render(props = getDefault()): RenderResult {
  return rtlRender(withRouter(<InformPlaceListItem {...props} />));
}

describe("<InformPlaceListItem />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  test("pass params", () => {
    const { getByRole, getByText, getByTitle } = render();
    expect(getByRole("link")).toHaveAttribute("href", "/entity/places/1");
    expect(getByText("Place")).toBeInTheDocument();
    expect(getByTitle("Fly to")).toBeInTheDocument();
  });

  test("pass onPlace", () => {
    const d = getDefault();
    const f = jest.fn();
    const { getByRole } = render({
      ...d,
      onPlace: f
    });
    fireEvent.click(getByRole("button"));
    expect(f).toBeCalledTimes(1);
  });
});
