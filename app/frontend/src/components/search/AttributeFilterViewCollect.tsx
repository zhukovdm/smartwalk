import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { AttributeFilterCollect } from "../../domain/types";
import AttributeFilterCheckBox from "./AttributeFilterCheckBox";

type CollectAutocompleteProps = {

  /** Name of a filter */
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
      fullWidth
      multiple
      onChange={(_, v) => onChange(v)}
      size={"small"}
      renderInput={(params) => (<TextField {...params} label={label} />)}
    />
  )
}

type AttributeFilterViewCollectProps = {

  /** Name of a filter */
  label: string;

  /** Possible items in the collection */
  bound: string[];

  /** Action setting new value */
  setter: (v: AttributeFilterCollect | undefined) => void;

  /** Initial value */
  initial: AttributeFilterCollect | undefined;
}

/**
 * Collection-specific filter view.
 */
export default function AttributeFilterViewCollect(
  { label, bound, setter, initial }: AttributeFilterViewCollectProps): JSX.Element {

  const [check, setCheck] = useState(!!initial);
  const [includes, setIncludes] = useState(initial ? initial.inc : []);
  const [excludes, setExcludes] = useState(initial ? initial.exc : []);

  const toggle = () => { setCheck(!check); };

  useEffect(() => {
    setter(check ? { inc: includes, exc: excludes } : undefined);
  }, [check, includes, excludes, setter]);

  return (
    <Stack
      rowGap={2}
      direction={"column"}
    >
      <AttributeFilterCheckBox
        label={label}
        checked={check}
        toggle={toggle}
      />
      <CollectAutocomplete
        label={"Includes"}
        value={includes}
        options={bound}
        disabled={!check}
        onChange={(v) => { setIncludes(v); }}
      />
      <CollectAutocomplete
        label={"Excludes"}
        value={excludes}
        options={bound}
        disabled={!check}
        onChange={(v) => { setExcludes(v); }}
      />
    </Stack>
  );
}
