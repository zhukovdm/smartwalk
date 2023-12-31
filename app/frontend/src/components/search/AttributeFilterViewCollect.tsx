import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import type {
  AttributeFilterCollect,
  AttributeFilterCollectLabel
} from "../../domain/types";
import AttributeFilterCheckBox from "./AttributeFilterCheckBox";

type CollectAutocompleteProps = {

  /** Name of a field */
  label: string;

  /** Current value on the filter */
  value: string[];

  /** Possible remaining options */
  options: string[];

  /** Flag disabling filter */
  disabled: boolean;

  /** Action handling changes on a filter */
  onChange: (v: string[]) => void;
};

/**
 * Selector of possible items in a collection.
 */
function CollectAutocomplete({ label, onChange, ...rest }: CollectAutocompleteProps): JSX.Element {
  return (
    <Autocomplete
      {...rest}
      role={"region"}
      aria-label={label}
      fullWidth
      multiple
      onChange={(_, v) => onChange(v)}
      size={"small"}
      renderInput={(params) => (<TextField {...params} label={label} />)}
    />
  )
}

export type AttributeFilterViewCollectProps = {

  /** Name of a filter */
  label: AttributeFilterCollectLabel;

  /** Possible items in the collection */
  bound: string[];

  /** Current value */
  value: AttributeFilterCollect | undefined;

  /** Callback setting new value */
  setter: (v: AttributeFilterCollect | undefined) => void;
}

const getDefault = (): AttributeFilterCollect => ({ inc: [], exc: [] });

/**
 * Collection-specific filter view.
 */
export default function AttributeFilterViewCollect(
  { label, bound, value, setter }: AttributeFilterViewCollectProps): JSX.Element {

  const defined = value !== undefined;

  const { inc: curInc, exc: curExc } = defined ? value : getDefault();

  return (
    <Stack
      rowGap={2}
      direction={"column"}
    >
      <AttributeFilterCheckBox
        label={label}
        checked={defined}
        onToggle={() => { setter(defined ? undefined : getDefault()) }}
      />
      <CollectAutocomplete
        label={"Include"}
        value={defined ? curInc : []}
        options={bound}
        disabled={!defined}
        onChange={(v) => { setter({ inc: v, exc: curExc }); }}
      />
      <CollectAutocomplete
        label={"Exclude"}
        value={defined ? curExc : []}
        options={bound}
        disabled={!defined}
        onChange={(v) => { setter({ inc: curInc, exc: v }); }}
      />
    </Stack>
  );
}
