import { Fragment } from "react";
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import {
  KeywordAdviceItem,
  KeywordCategory
} from "../../domain/types";
import { useSearchKeywordsAdvice } from "../../features/searchHooks";
import AttributeFiltersList from "./AttributeFiltersList";

type CategoryDialogProps = {

  /** Action hiding condition dialog. */
  onHide: () => void;

  /** Either new, or existing condition. */
  category?: KeywordCategory;

  /** Action inserting category at `i`-position. */
  insert: (category: KeywordCategory) => void;
};

/**
 * Dialog for category configuration (keyword and additional attributes).
 */
function CategoryDialog(
  { category, onHide, insert }: CategoryDialogProps): JSX.Element {

  const fullScreen = useMediaQuery(useTheme().breakpoints.down("sm"));

  const [input, setInput] = useState("");
  const [mount, setMount] = useState(true);
  const [value, setValue] = useState<KeywordAdviceItem | null>(category ?? null);

  const filters = structuredClone(category?.filters ?? {}); // clone!

  const {
    loading,
    options
  } = useSearchKeywordsAdvice(input, value);

  // hard reset of the attribute component
  useEffect(() => { if (!mount) { setMount(true); } }, [mount]);

  const discardAction = () => {
    onHide();
  };

  const confirmAction = () => {
    if (value) { insert({ ...value, filters: filters }); }
    onHide();
  };

  return (
    <Dialog open={true} fullScreen={fullScreen}>
      <DialogTitle>Add category</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <DialogContentText>
          Enter a keyword that places should associate with.
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
            setMount(false);
          }}
          onInputChange={(_, v) => { setInput(v); }}
          getOptionLabel={(o) => o.keyword ?? ""}
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
          isOptionEqualToValue={(o, v) => { return o.keyword === v.keyword }}
        />
        <DialogContentText>
          Configure attributes to customize this category (optional).
        </DialogContentText>
        {(mount && value)
          ? <AttributeFiltersList adviceItem={value} filters={filters} />
          : <Alert severity={"info"}>
              Attributes are keyword-specific.
            </Alert>
        }
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
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

type CategoryBoxProps = {

  /** List of already added categories. */
  categories: KeywordCategory[];

  /** Action deleting the category at `i`-position. */
  deleteCategory: (i: number) => void;

  /** Action inserting new condition at `i`-position. */
  updateCategory: (category: KeywordCategory, i: number) => void;
};

/**
 * Component rendering box with removable categories.
 */
export default function CategoryBox(
  { categories, deleteCategory, updateCategory }: CategoryBoxProps): JSX.Element {

  const [showDialog, setShowDialog] = useState(false);
  const [currCategory, setCurrCategory] = useState<number>(0);

  const dialog = (i: number) => {
    setCurrCategory(i);
    setShowDialog(true);
  };

  return (
    <Box>
      <Paper variant={"outlined"}>
        <Stack direction={"row"} flexWrap={"wrap"}>
          {categories.map((category, i) => (
            <Chip
              key={i}
              color={"primary"}
              sx={{ m: 0.35, fontWeight: "medium" }}
              variant={"filled"}
              label={`${i + 1}: ${category.keyword}`}
              onClick={() => dialog(i)}
              onDelete={() => deleteCategory(i)}
            />
          ))}
        </Stack>
        <Button
          sx={{ width: "100%" }}
          size={"large"}
          onClick={() => { dialog(categories.length); }}
        >
          <span>Add category</span>
        </Button>
      </Paper>
      {showDialog &&
        <CategoryDialog
          category={categories[currCategory]}
          onHide={() => setShowDialog(false)}
          insert={(category) => updateCategory(category, currCategory)}
        />
      }
    </Box>
  );
}
