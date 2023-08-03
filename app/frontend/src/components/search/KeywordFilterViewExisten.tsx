import { useEffect, useState } from "react";
import { FormGroup } from "@mui/material";
import { KeywordFilterExisten } from "../../domain/types";
import KeywordFilterCheckBox from "./KeywordFilterCheckBox";

type KeywordFilterViewExistenProps = {

  /** Name of a filter. */
  label: string;

  /** Value setter. */
  setter: (v: KeywordFilterExisten | undefined) => void;

  /** Initial value. */
  initial: KeywordFilterExisten | undefined;
};

/**
 * Filter telling if an attribute exists on an entity.
 */
export default function KeywordFilterViewExisten({ label, setter, initial }: KeywordFilterViewExistenProps): JSX.Element {

  const [check, setCheck] = useState(!!initial);

  const toggle = () => { setCheck(!check); };

  useEffect(() => { setter(check ? {} : undefined) }, [check, setter]);

  return (
    <FormGroup sx={{ display: "inline-block" }}>
      <KeywordFilterCheckBox label={label} checked={check} toggle={toggle} />
    </FormGroup>
  );
}
