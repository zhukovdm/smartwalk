import { useEffect, useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import { AttributeFilterExisten } from "../../domain/types";
import AttributeFilterCheckBox from "./AttributeFilterCheckBox";

type AttributeFilterViewExistenProps = {

  /** Name of a filter. */
  label: string;

  /** Value setter. */
  setter: (v: AttributeFilterExisten | undefined) => void;

  /** Initial value. */
  initial: AttributeFilterExisten | undefined;
};

/**
 * Filter telling if an attribute exists on an entity.
 */
export default function AttributeFilterViewExisten({ label, setter, initial }: AttributeFilterViewExistenProps): JSX.Element {

  const [check, setCheck] = useState(!!initial);

  const toggle = () => { setCheck(!check); };

  useEffect(() => { setter(check ? {} : undefined) }, [check, setter]);

  return (
    <FormGroup sx={{ display: "inline-block" }}>
      <AttributeFilterCheckBox
        label={label}
        checked={check}
        toggle={toggle}
      />
    </FormGroup>
  );
}
