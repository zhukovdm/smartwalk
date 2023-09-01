import { getSmartPlaceLink } from "../../utils/functions";
import { InformPlaceListItemProps } from "./InformPlaceListItem";
import PlaceButton from "./PlaceButton";
import RemoveButton from "./RemoveButton";
import StandardListItem from "./StandardListItem";

export type RemovablePlaceListItemProps = InformPlaceListItemProps & {

  /** Event handler */
  onRemove: () => void;
};

/**
 * Place list item with removing capabilities.
 */
export default function RemovablePlaceListItem(
  { place, onPlace, onRemove, ...rest }: RemovablePlaceListItemProps): JSX.Element {

  return (
    <StandardListItem
      label={place.name}
      link={getSmartPlaceLink(place.smartId)}
      l={
        <PlaceButton {...rest} onClick={onPlace} />
      }
      r={
        <RemoveButton onClick={onRemove} />
      }
    />
  );
}
