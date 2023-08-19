import { useEffect, useState } from "react";
import { Stack, TextField } from "@mui/material";
import { AttributeFilterTextual } from "../../domain/types";
import AttributeFilterCheckBox from "./AttributeFilterCheckBox";

type AttributeFilterViewTextualProps = {

  /** Label of an attribute. */
  label: string;

  /** Callback setting new value. */
  setter: (v: AttributeFilterTextual | undefined) => void;

  /** Initial value. */
  initial: AttributeFilterTextual | undefined;
};

export default function AttributeFilterViewTextual({ label, setter, initial }: AttributeFilterViewTextualProps) {

  const [check, setCheck] = useState(!!initial);
  const [value, setValue] = useState(initial ?? "");

  const toggle = () => { setCheck(!check); };

  useEffect(() => {
    setter((check && value.length > 0) ? value : undefined);
  }, [check, value, setter]);

  return (
    <Stack direction={"row"} spacing={1}>
      <AttributeFilterCheckBox
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
