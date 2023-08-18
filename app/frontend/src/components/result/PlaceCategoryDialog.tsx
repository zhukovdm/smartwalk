import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { Close } from "@mui/icons-material";
import {
  KeywordFilterCollect,
  KeywordFilterNumeric,
  KeywordFilterTextual,
  PlaceCategory
} from "../../domain/types";

type CollectSelectProps = {

  /** Collection category. */
  label: string;

  /** Items associated with the category. */
  items: string[];
};

function CollectSelect({ label, items }: CollectSelectProps): JSX.Element {

  return (
    <FormControl sx={{ m: 1 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={items}
        inputProps={{ readOnly: true }}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <Stack direction={"row"} flexWrap={"wrap"} gap={0.2}>
            {selected.map((v, i) => (<Chip key={i} label={v} />))}
          </Stack>
        )}
      />
    </FormControl>
  );
}

type PlaceCategoryDialogProps = {

  /** Category to be presented. */
  category: PlaceCategory;

  /** Action hiding dialog. */
  onHide: () => void;
};

/**
 * Simplified read-only category representation.
 */
export default function PlaceCategoryDialog(
  { category, onHide }: PlaceCategoryDialogProps): JSX.Element {

  const { keyword, filters } = category;
  const { es, bs, ns, ts, cs } = filters;

  const extractKeys = (xs: any) => Object.keys(xs ?? {}).filter((x) => !!(xs as any)[x]);
  const [esKeys, bsKeys, nsKeys, tsKeys, csKeys] = [es, bs, ns, ts, cs].map((xs) => extractKeys(xs));

  return (
    <Dialog onClose={onHide} open>
      <DialogTitle display={"flex"} justifyContent={"space-between"}>
        <span>Place condition</span>
        <IconButton size={"small"} onClick={onHide}>
          <Close fontSize={"small"} />
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
                  const { min, max } = ((ns as any)[n]) as KeywordFilterNumeric;
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
                  <Chip key={i} label={`${((ts as any)[t]) as KeywordFilterTextual} + ${t}`} variant={"outlined"} />
                ))}
              </Stack>
            </Stack>
          }
          {csKeys.length > 0 &&
            <Stack direction={"column"} gap={1}>
              <Typography>Includes any / Excludes all</Typography>
              <Stack direction={"column"} gap={1}>
                {csKeys.map((cat) => {
                  const { inc, exc } = ((cs as any)[cat]) as KeywordFilterCollect;
                  return (
                    <Stack direction={"column"} gap={1}>
                      <Typography>{cat}</Typography>
                      <CollectSelect label="Includes" items={inc} />
                      <CollectSelect label="Excludes" items={exc} />
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
