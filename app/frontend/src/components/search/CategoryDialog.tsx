import { Fragment, useState } from "react";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
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
import { useKeywordAdvice } from "../../features/searchHooks";
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
  } = useKeywordAdvice(input, value);

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
      <DialogTitle>{!!category ? "Modify" : "Add"} category</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: "470px" }}
      >
        <Typography>
          Enter a <Link href={"https://raw.githubusercontent.com/zhukovdm/smartwalk/main/data/assets/advice/keywords.txt"} title={"See examples of keywords at the link."}>keyword</Link> that places should associate with:
        </Typography>
        <Autocomplete
          value={value}
          disabled={!!category}
          clearOnBlur={false}
          options={options}
          loading={loading}
          filterOptions={(x) => x}
          noOptionsText={"No keywords found"}
          onChange={(_, v) => {
            setValue(v);
          }}
          onInputChange={(_, v) => {
            /**
             * This reset callback works because onChange gets called strictly
             * after onInputChange!
             * 
             * https://github.com/mui/material-ui/issues/18656#issuecomment-560561237
             */
            if (!category) {
              setValue(null);
            }
            setInput(v.trimStart());
          }}
          getOptionLabel={(o) => (o.keyword)}
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
        <Typography>
          Configure attributes to customize this keyword (optional):
        </Typography>
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
        <Typography fontSize={"small"}>
          Keywords have an <strong>&quot;instance of&quot;</strong> relationship with places (e.g., castle or museum). In contrast, attributes are non-defining features (e.g. has an image, capacity &ge; 100, or regional cuisine).
        </Typography>
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
