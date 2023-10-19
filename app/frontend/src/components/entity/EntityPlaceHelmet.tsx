import { Helmet, HelmetData } from "react-helmet-async";
import { getPlaceJsonLd } from "../../utils/jsonld";
import { ExtendedPlace } from "../../domain/types";

export type EntityPlaceHelmetProps = {

  /** url of a detailed view */
  url: string;

  /** place to be presented */
  place: ExtendedPlace;
};

export default function EntityPlaceHelmet({ url, place }: EntityPlaceHelmetProps): JSX.Element {
  return (
    <Helmet helmetData={new HelmetData({})}>
      <script type={"application/ld+json"}>
        {getPlaceJsonLd(url, place)}
      </script>
    </Helmet>
  );
}
