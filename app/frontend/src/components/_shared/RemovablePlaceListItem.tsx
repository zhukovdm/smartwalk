import { getSmartPlaceLink } from "../../domain/functions";
import { InformPlaceListItemProps } from "./InformPlaceListItem";
import PlaceButton from "./PlaceButton";
import RemoveButton from "./RemoveButton";
import StandardListItem from "./StandardListItem";

type RemovablePlaceListItemProps = InformPlaceListItemProps & {

  /** Event handler */
  onRemove: () => void;
};

/**
 * Place list item with removing capabilities.
 */
export default function RemovablePlaceListItem(
  { place: p, onPlace, onRemove, ...rest }: RemovablePlaceListItemProps): JSX.Element {

  return (
    <StandardListItem
      label={p.name}
      link={getSmartPlaceLink(p.smartId)}
      l={
        <PlaceButton {...rest} onClick={onPlace} />
      }
      r={
        <RemoveButton onClick={onRemove} />
      }
    />
  );
}
