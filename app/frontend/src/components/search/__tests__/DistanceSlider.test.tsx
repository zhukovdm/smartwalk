import {
  fireEvent,
  render as rtlRender
} from "@testing-library/react";
import DistanceSlider, { type DistanceSliderProps } from "../DistanceSlider";

const getProps = (): DistanceSliderProps => ({
  max: 100,
  seq: [20, 40, 60, 80],
  step: 10,
  distance: 50,
  dispatch: jest.fn(),
  "aria-label": "Maximum distance"
});

function render(props = getProps()) {
  return rtlRender(<DistanceSlider {...props} />);
}

describe("<DistanceSlider />", () => {
  
  test("render", () => {
    expect(render().container).toBeTruthy();
  });

  it("should dispatch new value (as a number) upon change", () => {
    const dispatch = jest.fn()
    const { getByRole } = render({
      ...getProps(),
      dispatch
    });
    expect(getByRole("slider")).toHaveValue("50");
    fireEvent.change(getByRole("slider", { name: "Maximum distance" }), { target: { value: "60" } });
    expect(dispatch).toHaveBeenCalledWith(60);
  });
});
