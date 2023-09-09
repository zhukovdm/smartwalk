import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import { withRouter } from "../../../utils/testUtils";
import RemovablePlaceListItem, {
  type RemovablePlaceListItemProps
} from "../RemovablePlaceListItem";

const getProps = (): RemovablePlaceListItemProps => ({
  place: {
    smartId: "1",
    name: "Place",
    location: { lon: 0.0, lat: 0.0 },
    keywords: [
      "castle",
      "museum"
    ],
    categories: [
      0
    ]
  },
  onPlace: jest.fn(),
  onRemove: jest.fn(),
  kind: "common",
  title: "Fly to"
});

function render(props = getProps()) {
  return rtlRender(withRouter(<RemovablePlaceListItem {...props} />));
}

describe("<RemovablePlaceListItem />", () => {

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
    const d = getProps();
    const f = jest.fn();
    const { getByRole } = render({
      ...d,
      onPlace: f
    });
    fireEvent.click(getByRole("button", { name: "Fly to" }));
    expect(f).toBeCalledTimes(1);
  });

  test("pass onRemove", () => {
    const d = getProps();
    const f = jest.fn();
    const { getByRole } = render({
      ...d,
      onRemove: f
    });
    fireEvent.click(getByRole("button", { name: "Remove point" }));
    expect(f).toBeCalledTimes(1);
  });
});
