import { getPlace } from "../../../utils/testData";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import SearchDirecsSequence, { type SearchDirecsSequenceProps } from "../SearchDirecsSequence";

jest.mock("vis-network");
global.alert = jest.fn();

const getProps = (): SearchDirecsSequenceProps => ({
  waypoints: [
    [
      {
        ...getPlace(),
        name: "Place A",
        placeId: "1"
      },
      true
    ],
    [
      {
        ...getPlace(),
        name: "Place B"
      },
      false
    ]
  ],
});

function render(props = getProps(), options: AppRenderOptions = {}) {
  return renderWithProviders(<SearchDirecsSequence {...props} />, options);
}

describe("<SearchDirecsSequence />", () => {

  test("render", () => {
    expect(render().container).toBeTruthy();
  });
});
