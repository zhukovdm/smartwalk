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
    <Stack direction={"row"} spacing={1}>
      <KeywordFilterCheckBox
        checked={check}
        label={label}
        toggle={toggle}
      />
      <TextField
        disabled={!check}
        fullWidth
        onChange={(e) => { setValue(e.target.value); }}
        size={"small"}
        value={value}
      />
    </Stack>
  );
}
