import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import {
  AttributeFilterCollect,
  AttributeFilterNumeric,
  AttributeFilterTextual,
  PlaceCategory
} from "../../domain/types";

type CategoryFilterCollectProps = {

  /** Collection category. */
  label: string;

  /** Items associated with the category. */
  items: string[];
};

function CategoryFilterCollect({ label, items }: CategoryFilterCollectProps): JSX.Element {

  return (
    <FormControl sx={{ m: 1 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        size={"small"}
        value={items}
        inputProps={{ readOnly: true }}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <Stack direction={"row"} flexWrap={"wrap"} gap={0.2}>
            {selected.map((v, i) => <Chip key={i} label={v} />)}
          </Stack>
        )}
      />
    </FormControl>
  );
}

type CategoryFilterDialogProps = {

  /** Flag showing the dialog */
  show: boolean;

  /** Category to be presented. */
  category: PlaceCategory;

  /** Action hiding dialog. */
  onHide: () => void;
};

/**
 * Simplified read-only category representation.
 */
export default function CategoryFilterDialog(
  { show, category, onHide }: CategoryFilterDialogProps): JSX.Element {

  const { keyword, filters } = category;
  const { es, bs, ns, ts, cs } = filters;

  const extractKeys = (xs: any) => Object.keys(xs ?? {}).filter((x) => !!(xs as any)[x]);
  const [esKeys, bsKeys, nsKeys, tsKeys, csKeys] = [es, bs, ns, ts, cs].map((xs) => extractKeys(xs));

  return (
    <Dialog
      aria-label={"Category"}
      open={show}
      onClose={onHide}
    >
      <DialogTitle
        aria-label={"Category"}
        display={"flex"}
        justifyContent={"space-between"}
      >
        <span>Category</span>
        <IconButton size={"small"} title={"Hide dialog"} onClick={onHide}>
          <CloseIcon fontSize={"small"} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack direction={"column"} gap={2} maxWidth={"450px"}>
          <TextField
            fullWidth
            defaultValue={keyword}
            disabled
            label={"Keyword"}
            size={"small"}
            sx={{ mt: 1 }}
          />
          {esKeys.length > 0 &&
            <Stack direction={"column"} gap={1}>
              <Typography>Should have</Typography>
              <Stack direction={"row"} flexWrap={"wrap"} gap={1}>
                {esKeys.map((e, i) => (<Chip key={i} label={e} variant={"outlined"} />))}
              </Stack>
            </Stack>
          }
          {bsKeys.length > 0 &&
            <Stack direction={"column"} gap={1}>
              <Typography>Yes / No</Typography>
              <Stack direction={"row"} flexWrap={"wrap"} gap={1}>
                {bsKeys.map((b, i) => (
                  <Chip key={i} label={`${b} == ${(bs as any)[b] ? "yes" : "no"}`} variant={"outlined"} />))}
              </Stack>
            </Stack>
          }
          {nsKeys.length > 0 &&
            <Stack direction={"column"} gap={1}>
              <Typography>Numeric</Typography>
              <Stack direction={"row"} flexWrap={"wrap"} gap={1}>
                {nsKeys.map((n, i) => {
                  const { min, max } = ((ns as any)[n]) as AttributeFilterNumeric;
                  return <Chip key={i} label={`${min} &leq; ${n} &leq; ${max}`} variant={"outlined"} />
                })}
              </Stack>
            </Stack>
          }
          {tsKeys.length > 0 &&
            <Stack direction={"column"} gap={1}>
              <Typography>Contains</Typography>
              <Stack direction={"row"} flexWrap={"wrap"} gap={1}>
                {tsKeys.map((t, i) => (
                  <Chip key={i} label={`${((ts as any)[t]) as AttributeFilterTextual} + ${t}`} variant={"outlined"} />
                ))}
              </Stack>
            </Stack>
          }
          {csKeys.length > 0 &&
            <Stack direction={"column"} gap={1}>
              <Typography>Includes any / Excludes all</Typography>
              <Stack direction={"column"} gap={1}>
                {csKeys.map((cat, i) => {
                  const { inc, exc } = ((cs as any)[cat]) as AttributeFilterCollect;
                  return (
                    <Stack key={i} direction={"column"} gap={1}>
                      <Typography>{cat}</Typography>
                      <CategoryFilterCollect label={"Includes"} items={inc} />
                      <CategoryFilterCollect label={"Excludes"} items={exc} />
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          }
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
