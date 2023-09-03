import {
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
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { AppContext } from "../../App";
import { UiPlace } from "../../domain/types";
import {
  appendSearchDirecsPlace,
  deleteSearchDirecsPlace,
  fromtoSearchDirecsPlace,
  reverseSearchDirecsWaypoints
} from "../../features/searchDirecsSlice";
import { useAppDispatch } from "../../features/storeHooks";
import { useSearchDirecsMap } from "../../features/searchHooks";
import RemovablePlaceListItem from "../_shared/RemovablePlaceListItem";
import ReverseButton from "../_shared/ReverseButton";
import VacantPlaceListItem from "../_shared/VacantPlaceListItem";
import SelectPointDialog from "./SelectPointDialog";

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
  onAppend: () => void;

  /** Handler reversing sequence. */
  onRevers: () => void;
};

/**
 * Control bar appending places and reversing sequence.
 */
function DirecsControlListItem({ onAppend, onRevers }: DirectControlListItemProps): JSX.Element {

  return (
    <Stack
      direction={"row"}
      gap={0.5}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <DragIndicatorIcon className={"action-place"} />
      </div>
      <VacantPlaceListItem
        kind={"action"}
        title={"Select waypoint"}
        label={"Select waypoint..."}
        onClick={onAppend}
      />
      <ReverseButton onClick={onRevers} />
    </Stack>
  );
}

type DirecsPresentListItemProps = {

  /** Position of the place in the sequence. */
  index: number;

  /** A place on the list with `stored` flag. */
  waypoint: [UiPlace, boolean];
};

/**
 * Element presenting added place (either custom, or stored).
 * 
 * Note that draggableProps and dragHandleProps behave unexpectedly if margin
 * is set ~> padding-bottom is a replacement.
 */
function DirecsPresentListItem({ waypoint: [w, s], index }: DirecsPresentListItemProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { map } = useContext(AppContext);

  return (
    <Draggable
      draggableId={`smartwalk-drag-place-${index}`}
      index={index}
    >
      {(provided) => (
        <div
          aria-label={w.name}
          role={"listitem"}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Stack
            direction={"row"}
            gap={0.5}
            paddingBottom={2}
          >
            <div
              title={"Drag"}
              style={{ display: "flex", alignItems: "center" }}
              {...provided.dragHandleProps}
            >
              <DragIndicatorIcon className={"action-place"} />
            </div>
            <RemovablePlaceListItem
              place={w}
              kind={s ? "stored" : "common"}
              title={"Fly to"}
              onPlace={() => { map?.flyTo(w); }}
              onRemove={() => { dispatch(deleteSearchDirecsPlace(index)); }}
            />
          </Stack>
        </div>
      )}
    </Draggable>
  );
}

type SearchDirecsSequenceProps = {

  /** Waypoints configured by the user. */
  waypoints: [UiPlace, boolean][];
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
      <Box
        aria-label={"Waypoints"}
        role={"list"}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <StrictModeDroppable droppableId={"droppable"}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {waypoints.map((w, i) => (
                  <DirecsPresentListItem
                    key={i}
                    waypoint={w}
                    index={i}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      </Box>
      <DirecsControlListItem
        onAppend={() => { setSelectDialog(true); }}
        onRevers={() => { dispatch(reverseSearchDirecsWaypoints()); }}
      />
      <SelectPointDialog
        show={selectDialog}
        kind={"common"}
        onHide={() => { setSelectDialog(false); }}
        onSelect={(place) => { dispatch(appendSearchDirecsPlace(place)); }}
      />
    </Box>
  );
}
