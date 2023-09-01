import { PlaceKind, UiPlace } from "../../domain/types";
import { getSmartPlaceLink } from "../../utils/functions";
import PlaceButton from "./PlaceButton";
import StandardListItem from "./StandardListItem";

export type InformPlaceListItemProps = {

  /** Place to be presented */
  place: UiPlace;

  /** Kind of a pin on the button */
  kind:  PlaceKind;

  /** Concise button title */
  title: string;

  /** Event handler for a location button */
  onPlace: () => void;
};

/**
 * Occupied `place` list item without action (appear in result, and viewer).
 */
export default function InformPlaceListItem(
  { place: p, onPlace, ...rest }: InformPlaceListItemProps): JSX.Element {

  return (
    <StandardListItem
      label={p.name}
      link={getSmartPlaceLink(p.smartId)}
      l={
        <PlaceButton {...rest} onClick={onPlace} />
      }
    />
  );
}
