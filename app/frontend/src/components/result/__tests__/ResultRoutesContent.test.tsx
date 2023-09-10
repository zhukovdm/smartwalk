import { getRoute } from "../../../utils/testData";
import {
  type AppRenderOptions,
  renderWithProviders
} from "../../../utils/testUtils";
import {
  initialResultRoutesState
} from "../../../features/resultRoutesSlice";
import ResultRoutesContent from "../ResultRoutesContent";

const N = 5;

const getState = (): AppRenderOptions => ({
  preloadedState: {
    resultRoutes: {
      ...initialResultRoutesState(),
      result: Array(N).fill(undefined).map(() => getRoute()),
      resultFilters: Array(N).fill(true)
    }
  }
});

function render(options: AppRenderOptions = getState()) {
  return renderWithProviders(<ResultRoutesContent />, options);
}

describe("<ResultRoutesContent />", () => {

  test("render", () => {
    const { container } = render();
    expect(container).toBeTruthy();
  });

  describe("header", () => {
    
    it("should generate for =1 route", () => {
      const { getByText } = render({
        preloadedState: {
          resultRoutes: {
            ...initialResultRoutesState(),
            result: [
              getRoute()
            ],
            resultFilters: Array()
          }
        }
      })
    });
  });
});
