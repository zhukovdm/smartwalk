import { Helmet } from "react-helmet-async";
import { render as rtlRender } from "@testing-library/react";
import { getExtendedPlace } from "../../../utils/testData";
import EntityPlaceHelmet, { type EntityPlaceHelmetProps } from "../EntityPlaceHelmet";

jest.mock("react-helmet-async");

const getDefault = (): EntityPlaceHelmetProps => ({
  place: getExtendedPlace(),
  url: "http://localhost/"
});

function render(props = getDefault()) {
  return rtlRender(<EntityPlaceHelmet {...props} />);
}

describe("<EntityPlaceHelmet />", () => {

  test("render and generate json-ld", () => {
    const { container } = render();
    expect(container).toBeTruthy();
    expect(Helmet).toHaveBeenCalled();
  });
});
