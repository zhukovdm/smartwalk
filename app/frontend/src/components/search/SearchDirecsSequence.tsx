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
import { getSmartPlaceLink } from "../../domain/functions";
import {
  appendSearchDirecsPlace,
  deleteSearchDirecsPlace,
  fromtoSearchDirecsPlace,
  reverseSearchDirecsWaypoints
} from "../../features/searchDirecsSlice";
import { useAppDispatch } from "../../features/storeHooks";
import { useSearchDirecsMap } from "../../features/searchHooks";
import { DeleteButton, PlaceButton, SwapButton } from "../shared/_buttons";
import { ListItemLabel } from "../shared/_list-items";
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
    <Stack
      color={"gray"}
      direction={"row"}
      gap={0.5}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <DragIndicator />
      </div>
      <Stack
        direction={"row"}
        gap={0.5}
        onClick={onAppend}
        sx={{ width: "100%", cursor: "pointer" }}
      >
        <PlaceButton kind={"adding"} onPlace={() => {}} />
        <ListItemLabel label={"Append point..."} />
      </Stack>
      <SwapButton onSwap={onRevers} title={"Reverse"} />
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
          <Stack
            direction={"row"}
            gap={0.5}
            paddingBottom={2}
          >
            <div
              style={{ display: "flex", alignItems: "center" }}
              {...provided.dragHandleProps}
            >
              <DragIndicator />
            </div>
            <PlaceButton
              kind={place.placeId ? "stored" : "common"}
              onPlace={() => { map?.flyTo(place); }}
            />
            <ListItemLabel
              label={place.name}
              link={place.smartId ? getSmartPlaceLink(place.smartId) : undefined}
            />
            <DeleteButton onDelete={() => { dispatch(deleteSearchDirecsPlace(index)); }} />
          </Stack>
        </div>
      )}
    </Draggable>
  );
}

type SearchDirecsSequenceProps = {

  /** Waypoints configured by the user. */
  waypoints: UiPlace[];
}

/**
 * Component rendering sequence for searching directions.
 */
export default function SearchDirecsSequence({ waypoints }: SearchDirecsSequenceProps): JSX.Element {

  const dispatch = useAppDispatch();
  const [selectDialog, setSelectDialog] = useState(false);

  useSearchDirecsMap(waypoints);

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!source || !destination || source.index === destination.index) { return; }
    dispatch(fromtoSearchDirecsPlace({ fr: source.index, to: destination.index }));
  };

  return (
    <Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId={"droppable"}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {waypoints.map((place, i) => (
                <DirecsPresentListItem
                  key={i}
                  place={place}
                  index={i}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
      <DirecsControlListItem
        onAppend={() => { setSelectDialog(true); }}
        onRevers={() => { dispatch(reverseSearchDirecsWaypoints()); }}
      />
      <SelectPlaceDialog
        show={selectDialog}
        kind={"common"}
        onHide={() => { setSelectDialog(false); }}
        onSelect={(place) => { dispatch(appendSearchDirecsPlace(place)); }}
      />
    </Box>
  );
}
