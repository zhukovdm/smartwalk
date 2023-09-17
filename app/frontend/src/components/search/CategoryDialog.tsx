import { Fragment, useState } from "react";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import type {
  AttributeFilterBoolean,
  AttributeFilterBooleanLabel,
  AttributeFilterCollect,
  AttributeFilterCollectLabel,
  AttributeFilterExisten,
  AttributeFilterExistenLabel,
  AttributeFilterNumeric,
  AttributeFilterNumericLabel,
  AttributeFilterTextual,
  AttributeFilterTextualLabel,
  KeywordAdviceItem,
  KeywordCategory
} from "../../domain/types";
import { useSearchKeywordsAdvice } from "../../features/searchHooks";
import AttributeFiltersList from "./AttributeFiltersList";

export type CategoryDialogProps = {

  /** Maybe existing category */
  category?: KeywordCategory;

  /** Hiding callback */
  onHide: () => void;

  /** Action inserting category at position `i` */
  onInsert: (category: KeywordCategory) => void;
};

/**
 * Dialog for category configuration (keyword and additional attributes).
 */
export default function CategoryDialog(
  { category, onHide, onInsert }: CategoryDialogProps): JSX.Element {

  const fullScreen = useMediaQuery(useTheme().breakpoints.down("sm"));

  const [input, setInput] = useState("");
  const [value, setValue] = useState<KeywordAdviceItem | null>(category ?? null);

  const [filters, setFilters] = useState(structuredClone(category?.filters ?? {})); // clone!

  const setFilterExisten = (attr: AttributeFilterExistenLabel, value: AttributeFilterExisten | undefined) => {
    setFilters({ ...filters, es: { ...filters.es, [attr]: value } });
  };

  const setFilterBoolean = (attr: AttributeFilterBooleanLabel, value: AttributeFilterBoolean | undefined) => {
    setFilters({ ...filters, bs: { ...filters.bs, [attr]: value } });
  };

  const setFilterNumeric = (attr: AttributeFilterNumericLabel, value: AttributeFilterNumeric | undefined) => {
    setFilters({ ...filters, ns: { ...filters.ns, [attr]: value } });
  };

  const setFilterTextual = (attr: AttributeFilterTextualLabel, value: AttributeFilterTextual | undefined) => {
    setFilters({ ...filters, ts: { ...filters.ts, [attr]: value } });
  };

  const setFilterCollect = (attr: AttributeFilterCollectLabel, value: AttributeFilterCollect | undefined) => {
    setFilters({ ...filters, cs: { ...filters.cs, [attr]: value } });
  };

  const {
    loading,
    options
  } = useSearchKeywordsAdvice(input, value);

  const discardAction = () => {
    onHide();
  };

  const confirmAction = () => {
    if (value) {
      onInsert({ ...value, filters: filters });
    }
    onHide();
  };

  return (
    <Dialog
      open
      fullScreen={fullScreen}
    >
      <DialogTitle>Add category</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <DialogContentText>
          Enter a keyword that places should associate with:
        </DialogContentText>
        <Autocomplete
          value={value}
          disabled={!!category}
          options={options}
          loading={loading}
          filterOptions={(x) => x}
          noOptionsText={"No keywords found"}
          onChange={(_, v) => {
            setValue(v);
          }}
          onInputChange={(_, v) => {
            setInput(v.trimStart());
          }}
          getOptionLabel={(o) => (o.keyword ?? "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label={"Keyword"}
              placeholder={"Start typing..."}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <Fragment>
                    {loading ? <CircularProgress color={"inherit"} size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </Fragment>
                )
              }}
            />
          )}
          size={"small"}
          isOptionEqualToValue={(o, v) => (o.keyword === v.keyword)}
        />
        <DialogContentText>
          Configure attributes to customize this category (optional):
        </DialogContentText>
        {(!!value)
          ? <AttributeFiltersList
              adviceItem={value}
              filters={filters}
              key={value.keyword}
              onExistenUpdate={setFilterExisten}
              onBooleanUpdate={setFilterBoolean}
              onNumericUpdate={setFilterNumeric}
              onTextualUpdate={setFilterTextual}
              onCollectUpdate={setFilterCollect}
            />
          : <Alert severity={"info"}>
              Attributes are keyword-specific.
            </Alert>
        }
      </DialogContent>
      <DialogActions
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Button
          color={"error"}
          onClick={discardAction}
        >
          <span>Discard</span>
        </Button>
        <Button
          disabled={!value}
          onClick={confirmAction}
        >
          <span>Confirm</span>
        </Button>
      </DialogActions>
    </Dialog>
  );
}