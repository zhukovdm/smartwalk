import {
  MouseEventHandler,
  useContext,
  useEffect,
  useState
} from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProps,
  DropResult,
} from "react-beautiful-dnd";
import { Box, Stack } from "@mui/material";
import { DragIndicator } from "@mui/icons-material";
import { AppContext } from "../../App";
import { UiPlace } from "../../domain/types";
import { point2place } from "../../utils/helpers";
import { useAppDispatch } from "../../features/hooks";
import {
  appendSearchDirecsPlace,
  deleteSearchDirecsPlace,
  fromtoSearchDirecsPlace,
  setSearchDirecsSequence,
  updateSearchDirecsPlace
} from "../../features/searchDirecsSlice";
import {
  DeleteButton,
  PlaceButton,
  SwapButton
} from "../shared/buttons";
import { ListItemLabel } from "../shared/list-items";
import SelectPlaceDialog from "../shared/SelectPlaceDialog";

/**
 * Hot fix for TypeScript strict mode support.
 * https://github.com/atlassian/react-beautiful-dnd/issues/2399#issuecomment-1175638194
 */
export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  return (!enabled) ? null : <Droppable {...props}>{children}</Droppable>;
};

type DirectControlListItemProps = {

  /** Handler initiating append action. */
  onAppend: MouseEventHandler<Element>;

  /** Handler reversing sequence. */
  onRevers: MouseEventHandler<Element>;
};

function DirecsControlListItem({ onAppend, onRevers }: DirectControlListItemProps): JSX.Element {

  return (
    <Stack direction="row" gap={0.5} color="gray">
      <div style={{ display: "flex", alignItems: "center" }}>
        <DragIndicator />
      </div>
      <Stack direction="row" gap={0.5} onClick={onAppend} sx={{ width: "100%", cursor: "pointer" }}>
        <PlaceButton kind="custom" onPlace={() => { }} />
        <ListItemLabel label={"Append point..."} />
      </Stack>
      <SwapButton onSwap={onRevers} title="Reverse" />
    </Stack>
  );
}

type DirecsPresentListItemProps = {

  /** Position of the place in the sequence. */
  index: number;

  /** Already added place. */
  place: UiPlace;
};

/**
 * Element presenting added place (either custom, or stored).
 * 
 * Note that draggableProps and dragHandleProps behave unexpectedly if margin
 * is set ~> padding-bottom is a replacement.
 */
function DirecsPresentListItem({ place, index }: DirecsPresentListItemProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { map } = useContext(AppContext);

  return (
    <Draggable draggableId={`place-${index}`} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <Stack direction="row" gap={0.5} paddingBottom={2}>
            <div style={{ display: "flex", alignItems: "center" }} {...provided.dragHandleProps}>
              <DragIndicator />
            </div>
            <PlaceButton
              kind={place.placeId ? "stored" : "custom"}
              onPlace={() => { map?.flyTo(place); }}
            />
            <ListItemLabel label={place.name} />
            <DeleteButton onDelete={() => { dispatch(deleteSearchDirecsPlace(index)); }} />
          </Stack>
        </div>
      )}
    </Draggable>
  );
}

type SearchDirecsSequenceProps = {

  /** Sequence of places entered by the user. */
  sequence: UiPlace[];
}

/**
 * Component rendering sequence for searching directions.
 */
export default function SearchDirecsSequence({ sequence }: SearchDirecsSequenceProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { map } = useContext(AppContext);

  const [selectDialog, setSelectDialog] = useState(false);

  useEffect(() => {
    map?.clear();
    sequence.forEach((place, i) => {
      place.placeId
        ? map?.addStored(place)
        : map?.addCustom(place, true).withDrag((pt) => { dispatch(updateSearchDirecsPlace({ place: point2place(pt), index: i})); });
    });
  }, [map, dispatch, sequence]);

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!source || !destination || source.index === destination.index) { return; }
    dispatch(fromtoSearchDirecsPlace({ fr: source.index, to: destination.index }));
  };

  return (
    <Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="droppable">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {sequence.map((place, i) => <DirecsPresentListItem key={i} place={place} index={i} />)}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
      <DirecsControlListItem
        onAppend={() => { setSelectDialog(true); }}
        onRevers={() => { dispatch(setSearchDirecsSequence([...sequence].reverse())); }}
      />
      {selectDialog &&
        <SelectPlaceDialog
          kind="custom"
          onHide={() => { setSelectDialog(false); }}
          onSelect={(place) => { dispatch(appendSearchDirecsPlace(place)); }}
        />
      }
    </Box>
  );
}
