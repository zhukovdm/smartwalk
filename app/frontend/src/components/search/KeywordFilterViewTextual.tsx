import { useEffect, useState } from "react";
import { Stack, TextField } from "@mui/material";
import { KeywordFilterTextual } from "../../domain/types";
import KeywordFilterCheckBox from "./KeywordFilterCheckBox";

type KeywordFilterViewTextualProps = {

  /**  */
  label: string;

  /**  */
  setter: (v: KeywordFilterTextual | undefined) => void;

  /**  */
  initial: KeywordFilterTextual | undefined;
};

export default function KeywordFilterViewTextual({ label, setter, initial }: KeywordFilterViewTextualProps) {

  const [check, setCheck] = useState(!!initial);
  const [value, setValue] = useState(initial ?? "");

  const toggle = () => { setCheck(!check); };

  useEffect(() => {
    setter((check && value.length > 0) ? value : undefined);
  }, [check, value, setter]);

  return (
    <Stack spacing={1} direction="row">
      <KeywordFilterCheckBox label={label} checked={check} toggle={toggle} />
      <TextField fullWidth size="small" value={value} disabled={!check} onChange={(e) => { setValue(e.target.value); }} />
    </Stack>
  );
}
