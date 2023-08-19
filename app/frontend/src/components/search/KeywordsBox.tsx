import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { AppContext } from "../../App";
import { KeywordAdviceItem, KeywordCategory } from "../../domain/types";
import { SmartWalkFetcher } from "../../utils/smartwalk";
import { setBounds } from "../../features/panelSlice";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";
import KeywordFiltersList from "./KeywordFiltersList";

type CategoryDialogProps = {

  /** Action hiding condition dialog. */
  onHide: () => void;

  /** A set of keywords associated with created conditions. */
  keywords: Set<string>;

  /** Either new, or existing condition. */
  category?: KeywordCategory;

  /** Action inserting category at `i`-position. */
  insert: (category: KeywordCategory) => void;
};

function CategoryDialog({ category, keywords, onHide, insert }: CategoryDialogProps): JSX.Element {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { adviceKeywords: autocs } = useContext(AppContext).smart;
  const { bounds } = useAppSelector(state => state.panel);

  const dispatch = useAppDispatch();

  const [input, setInput] = useState("");
  const [mount, setMount] = useState(true);
  const [error, setError] = useState(false);

  const [value, setValue] = useState<KeywordAdviceItem | null>(category ?? null);
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<KeywordAdviceItem[]>([]);

  const filters = category ? structuredClone(category.filters) : {};

  // hard reset of the attribute component
  useEffect(() => { if (!mount) { setMount(true); } }, [mount]);

  // fetch bounds if not already present
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        if (!bounds) {
          const obj = await SmartWalkFetcher.adviceBounds();
          if (obj) {
            obj.capacity.min = Math.max(obj.capacity.min, 0);
            obj.capacity.max = Math.min(obj.capacity.max, 500);
  
            obj.minimumAge.min = Math.max(obj.minimumAge.min, 0);
            obj.minimumAge.max = Math.min(obj.minimumAge.max, 150);
  
            obj.rating.min = Math.max(obj.rating.min, 0);
            obj.rating.max = Math.min(obj.rating.max, 5);
  
            obj.year.max = Math.min(obj.year.max, new Date().getFullYear());
  
            if (!ignore) {
              dispatch(setBounds(obj));
            }
          }
        }
      }
      catch (ex) { alert(ex); }
    };

    load();
    return () => { ignore = true; };
  }, [dispatch, bounds]);

  // fetch autocomplete options based on the user input
  useEffect(() => {
    const prefix = input.toLocaleLowerCase();
    if (!prefix.length) { setOptions(value ? [value] : []); return; }

    const cached = autocs.get(prefix);
    if (cached) { setOptions(cached); return; }

    new Promise((res, _) => { res(setLoading(true)); })
      .then(() => SmartWalkFetcher.adviceKeywords(prefix))
      .then((items) => {
        if (items) { autocs.set(prefix, items); setOptions(items); }
      })
      .finally(() => { setLoading(false); });
  }, [input, value, autocs]);

  // store selected keyword with filters
  const confirm = () => {
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
          noOptionsText="No keywords"
          onChange={(_, v) => {
            setValue(v);
            setMount(false);
            setError(!v || keywords.has(v.keyword));
          }}
          onInputChange={(_, v) => { setInput(v); }}
          getOptionLabel={(o) => o.keyword ?? ""}
          renderInput={(params) => (
            <TextField
              {...params}
              error={error}
              helperText={error ? "Keyword already appears in the box." : undefined}
              placeholder={"Start typing..."}
            />
          )}
          isOptionEqualToValue={(o, v) => { return o.keyword === v.keyword }}
        />
        <DialogContentText>
          Select (optional) attributes to customize this condition further.
        </DialogContentText>
        { (!error && mount && value)
          ? (<KeywordFiltersList adviceItem={value} filters={filters} />)
          : (<Alert severity="info">Attributes are keyword-specific.</Alert>)
        }
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={() => { onHide(); }} color="error">Discard</Button>
        <Button onClick={confirm} color="primary" disabled={!value || error}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}

type KeywordsBoxProps = {

  /** List of already added categories. */
  categories: KeywordCategory[];

  /** Action deleting the category at `i`-position. */
  deleteCategory: (i: number) => void;

  /** Action inserting new condition at `i`-position. */
  updateCategory: (category: KeywordCategory, i: number) => void;
};

/**
 * Component rendering box with removable keywords.
 */
export default function KeywordsBox(
  { categories, deleteCategory, updateCategory }: KeywordsBoxProps): JSX.Element {

  const [showDialog, setShowDialog] = useState(false);
  const [currCategory, setCurrCategory] = useState<number>(0);

  const dialog = (i: number) => {
    setCurrCategory(i);
    setShowDialog(true);
  };

  return (
    <Box>
      <Paper variant={"outlined"}>
        <Stack direction={"row"} sx={{ flexWrap: "wrap" }}>
          {categories.map((condition, i) => (
            <Chip
              key={i}
              color={"primary"}
              variant={"outlined"}
              sx={{ m: 0.35, color: "black" }}
              label={condition.keyword}
              onClick={() => dialog(i)}
              onDelete={() => deleteCategory(i)}
            />
          ))}
        </Stack>
        <Button
          size={"large"}
          sx={{ width: "100%" }}
          onClick={() => { dialog(categories.length); }}
        >
          <span>Add category</span>
        </Button>
      </Paper>
      {showDialog &&
        <CategoryDialog
          category={categories[currCategory]}
          onHide={() => setShowDialog(false)}
          keywords={new Set(categories.map((v) => v.keyword))}
          insert={(category) => updateCategory(category, currCategory)}
        />
      }
    </Box>
  );
}
