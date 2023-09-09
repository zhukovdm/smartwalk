import {
  act,
  fireEvent,
  waitFor,
  within
} from "@testing-library/react";
import { LeafletMap } from "../../../utils/leaflet";
import { getExtendedPlace, getPlace } from "../../../utils/testData";
import {
  AppRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import { context } from "../../../features/context";
import { initialSearchDirecsState } from "../../../features/searchDirecsSlice";
import { type ExtraArrayLabel } from "../ExtraArray";
import EntityPlaceHelmet from "../EntityPlaceHelmet";
import EntityPlaceContent, {
  type EntityPlaceContentProps
} from "../EntityPlaceContent";

jest.mock("../EntityPlaceHelmet");

const getDefault = (): EntityPlaceContentProps => ({
  place: getExtendedPlace()
});

function render(props = getDefault(), options: AppRenderOptions = {}) {
  return renderWithProviders(<EntityPlaceContent {...props} />, options);
}

describe("<EntityPlaceContent />", () => {

  test("render", async () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  it("should render helmet", () => {
    render();
    expect(EntityPlaceHelmet).toHaveBeenCalled();
  })

  it("should render name in the header", () => {
    const { getByText } = render();
    expect(getByText(getDefault().place.name)).toBeInTheDocument();
  });

  it("should draw point and polygon", () => {
    const map = new LeafletMap();

    const clear = jest.spyOn(map, "clear").mockImplementation(jest.fn());
    const flyTo = jest.spyOn(map, "flyTo").mockImplementation(jest.fn());
    const drawPolygon = jest.spyOn(map, "drawPolygon").mockImplementation(jest.fn());
    const addCommon = jest.spyOn(map, "addCommon").mockImplementation(jest.fn());
    const addStored = jest.spyOn(map, "addStored").mockImplementation(jest.fn());

    render(getDefault(), { context: { ...context, map: map } });

    expect(clear).toHaveBeenCalled();
    expect(flyTo).toHaveBeenCalled();
    expect(drawPolygon).toHaveBeenCalled();
    expect(addCommon).toHaveBeenCalled();
    expect(addStored).not.toHaveBeenCalled();
  });

  it("should show informative alert", () => {
    const { getByRole } = render();
    expect(within(getByRole("alert")).getByText("This place is not in your Favorites yet.")).toBeInTheDocument();
  });

  it("should redraw alert and map upon Save", async () => {
    const map = new LeafletMap();
    const addCommon = jest.spyOn(map, "addCommon").mockImplementation(jest.fn());
    const addStored = jest.spyOn(map, "addStored").mockImplementation(jest.fn());

    const { store, getByRole } = render(getDefault(), { context: { ...context, map: map } });
    expect(addCommon).toHaveBeenCalledTimes(1);
    expect(addStored).toHaveBeenCalledTimes(0);
    expect(store.getState().favorites.places).toHaveLength(0);

    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "Save" }));
    act(() => {
      fireEvent.click(getByRole("button", { name: "Save" }));
    });
    await waitFor(() => {
      expect(within(getByRole("alert")).getByText("Medieval castle")).toBeInTheDocument();
    });
    expect(store.getState().favorites.places).toHaveLength(1);

    expect(addCommon).toHaveBeenCalledTimes(1);
    expect(addStored).toHaveBeenCalledTimes(1);
  });

  it("should Append place to the direction sequence state", async () => {
    const { store, getByRole, queryByRole } = render(getDefault(), {
      preloadedState: {
        searchDirecs: {
          ...initialSearchDirecsState(),
          waypoints: [
            { ...getPlace(), name: "Place A" }
          ]
        }
      }
    });
    fireEvent.click(getByRole("button", { name: "Menu" }));
    fireEvent.click(getByRole("menuitem", { name: "Append" }));
    act(() => {
      fireEvent.click(getByRole("button", { name: "Confirm" }));
    })
    await waitFor(() => {
      expect(queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(store.getState().searchDirecs.waypoints).toHaveLength(2);
  });

  it("should generate list of keywords", () => {
    const { getByRole } = render();
    expect(within(getByRole("list", { name: "Keywords" })).getAllByRole("listitem").length).toBe(3);
  });

  it("should generate address", () => {
    const { getByRole } = render();
    const region = getByRole("region", { name: "Address" });
    expect(within(region).getByTitle("Address"));
    expect(within(region).getByText("Malostranske namesti, 1, 100 00, Prague 1, Prague, Czech Republic")).toBeInTheDocument();
  });

  it("should generate website", () => {
    const { getByRole, getByTitle } = render();
    expect(getByTitle("Webpage")).toBeInTheDocument();
    expect(getByRole("link", { name: "https://www.medieval.com/" })).toBeInTheDocument();
  });

  it("should generate phone", () => {
    const { getByRole, getByTitle } = render();
    expect(getByTitle("Phone number")).toBeInTheDocument();
    expect(getByRole("link", { name: "+420 123 456 789" })).toBeInTheDocument();
  });

  it("should generate email", () => {
    const { getByRole, getByTitle } = render();
    expect(getByTitle("Email")).toBeInTheDocument();
    expect(getByRole("link", { name: "medieval@castle.com" })).toBeInTheDocument();
  });

  it("should generate social networks", () => {
    const { getByRole } = render();
    const region = getByRole("region", { name: "Social networks" });
    expect(within(region).getAllByRole("link")).toHaveLength(7);
    [
      ["Facebook", "a"],
      ["Instagram", "b"],
      ["LinkedIn", "c"],
      ["Pinterest", "d"],
      ["Telegram", "e"],
      ["Twitter", "f"],
      ["YouTube", "g"],
    ].forEach(([title, link]) => {
      expect(within(region).getByTitle(`${title} profile`)).toBeInTheDocument();
      expect(within(region).getByRole("link", { name: link }));
    });
  });

  it("should generate opening hours", () => {
    const { getByRole } = render();
    const region = getByRole("region", { name: "Opening hours" });
    expect(within(region).getByTitle("Opening hours"));
    expect(within(region).getByText("Tue 08:00 - 16:30")).toBeInTheDocument();
    expect(within(region).getByText("Sun closed")).toBeInTheDocument();
  });

  it("should generate charge", () => {
    const { getByRole } = render();
    const region = getByRole("region", { name: "Charge" });
    expect(within(region).getByTitle("Charge")).toBeInTheDocument();
    expect(within(region).getByText("200 CZK per hour")).toBeInTheDocument();
  });

  it("should generate image", () => {
    const { getByRole } = render();
    expect(getByRole("img", { name: "image" })).toBeInTheDocument();
  });

  it("should generate description", () => {
    const { getByLabelText } = render();
    expect(within(getByLabelText("Description")).getByText(getDefault().place.attributes.description!)).toBeInTheDocument();
  });

  it("should generate rating stars", () => {
    const { getByRole } = render();
    expect(within(getByRole("region", { name: "Rating" })).getByRole("img", { name: "5 Stars" })).toBeInTheDocument();
  });

  it("should generate collections", () => {
    const { getByLabelText, getByText } = render();
    (
      [
        ["clothes", "shirts, trousers"],
        ["cuisine", "czech, oriental"],
        ["denomination", "a, b, c"],
        ["payment", "cash, bitcoin, visa"],
        ["rental", "binoculars"]
      ] as [ExtraArrayLabel, string][]
    ).forEach(([l, c]) => {
      expect(getByLabelText(l)).toBeInTheDocument();
      expect(getByText(c)).toBeInTheDocument();
    });
  });

  it("should generate facts", () => {
    const { getByRole } = render();
    const facts = getByRole("region", { name: "Facts" });
    [
      "fee",
      "drinking water",
      "no internet access",
      "no smoking",
      "no takeaway",
      "toilets",
      "wheelchair",
      "capacity 300",
      "minimum age 1",
      "year 1645"
    ].forEach((fact) => {
      expect(within(facts).getByText(fact));
    });
  });
});
