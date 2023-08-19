import { useEffect, useState } from "react";
import { Autocomplete, Stack, TextField } from "@mui/material";
import { KeywordFilterCollect } from "../../domain/types";
import { useAppSelector } from "../../features/storeHooks";
import KeywordFilterCheckBox from "./KeywordFilterCheckBox";

type CollectAutocompleteProps = {

  /** Name of a filter. */
  label: string;

  /** Current value on the filter. */
  value: string[];

  /** Possible remaining options. */
  options: string[];

  /** Flag disabling filter. */
  disabled: boolean;

  /** Action handling changes on a filter. */
  onChange: (v: string[]) => void;
};

function CollectAutocomplete({ label, onChange, ...rest }: CollectAutocompleteProps): JSX.Element {
  return (
    <Autocomplete
      {...rest}
      multiple
      fullWidth
      onChange={(_, v) => onChange(v)}
      renderInput={(params) => (<TextField {...params} label={label} />)}
    />
  )
}

type KeywordFilterViewCollectProps = {

  /** Name of a filter. */
  label: string;

  /** Action setting new value. */
  setter: (v: KeywordFilterCollect | undefined) => void;

  /** Initial value. */
  initial: KeywordFilterCollect | undefined;
}

/**
 * Collection-specific filter view.
 */
export default function KeywordFilterViewCollect({ label, setter, initial }: KeywordFilterViewCollectProps): JSX.Element {

  const bound = (useAppSelector((state) => state.panel.bounds) as any)[label] as string[];

  const [check, setCheck] = useState(!!initial);
  const [includes, setIncludes] = useState(initial ? initial.inc : []);
  const [excludes, setExcludes] = useState(initial ? initial.exc : []);

  const toggle = () => { setCheck(!check); };

  useEffect(() => {
    setter(check ? { inc: includes, exc: excludes } : undefined);
  }, [check, includes, excludes, setter]);

  return (
    <Stack spacing={3} direction="column">
      <KeywordFilterCheckBox label={label} checked={check} toggle={toggle} />
      <CollectAutocomplete
        label="Includes"
        value={includes}
        options={bound}
        disabled={!check}
        onChange={(v) => { setIncludes(v); }}
      />
      <CollectAutocomplete
        label="Excludes"
        value={excludes}
        options={bound}
        disabled={!check}
        onChange={(v) => { setExcludes(v); }}
      />
    </Stack>
  );
}
