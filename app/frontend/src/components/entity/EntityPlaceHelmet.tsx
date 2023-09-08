import { Helmet, HelmetData } from "react-helmet-async";
import { getJsonLdPlace } from "../../utils/jsonld";
import { ExtendedPlace } from "../../domain/types";

export type EntityPlaceHelmetProps = {
  url: string;
  place: ExtendedPlace;
};

export default function EntityPlaceHelmet({ url, place }: EntityPlaceHelmetProps): JSX.Element {
  return (
    <Helmet helmetData={new HelmetData({})}>
      <script type={"application/ld+json"}>
        {getJsonLdPlace(url, place)}
      </script>
    </Helmet>
  );
}
