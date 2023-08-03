import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { KeywordAutoc } from "../../domain/types";
import { AutocAttributes } from "../../utils/helpers";
import { useAppSelector } from "../../features/hooks";
import KeywordFilterViewExisten from "./KeywordFilterViewExisten";
import KeywordFilterViewBoolean from "./KeywordFilterViewBoolean";
import KeywordFilterViewNumeric from "./KeywordFilterViewNumeric";
import KeywordFilterViewTextual from "./KeywordFilterViewTextual";
import KeywordFilterViewCollect from "./KeywordFilterViewCollect";

type KeywordAttributeListProps = {

  /** Autocomplete confguration for a particular word. */
  autoc: KeywordAutoc;

  /** Latest known filters. */
  filters: any; // (!)
};

/**
 * Renders five different types of attributes in a `type-unsafe` manner.
 */
export default function KeywordFilterList({ autoc, filters }: KeywordAttributeListProps): JSX.Element {

  const expandIcon = <ExpandMore />

  const { bounds } = useAppSelector(state => state.panel);
  const { es, bs, ns, ts, cs } = AutocAttributes.group(autoc.attributeList);

  return(
    <Box>
      {(es.length > 0) &&
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={expandIcon}>
            <Typography>Should have</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1} direction="row" justifyContent="center" sx={{ flexWrap: "wrap" }}>
              {es.map((e, i) => (
                <KeywordFilterViewExisten key={i} label={e} setter={(v) => { filters.existens[e] = v; } } initial={filters.existens[e]} />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
      {(bs.length > 0) &&
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={expandIcon}>
            <Typography>Yes / No</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1}>
              {bs.map((b, i) => (
                <KeywordFilterViewBoolean key={i} label={b} setter={(v) => { filters.booleans[b] = v; } } initial={filters.booleans[b]} />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
      {(ns.length > 0 && bounds) &&
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={expandIcon}>
            <Typography>Numeric</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={3}>
              {ns.map((n, i) => (
                <KeywordFilterViewNumeric key={i} label={n} setter={(v) => { filters.numerics[n] = v; }} initial={filters.numerics[n]} />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
      {(ts.length > 0) &&
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={expandIcon}>
            <Typography>Contains text</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack>
              {ts.map((t, i) => (
                <KeywordFilterViewTextual key={i} label={t} setter={(v) => { filters.textuals[t] = v; }} initial={filters.textuals[t]} />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
      {(cs.length > 0 && bounds) &&
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={expandIcon}>
            <Typography>Include any / Exclude all</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack>
              {cs.map((c, i) => (
                <KeywordFilterViewCollect key={i} label={c} setter={(v) => { filters.collects[c] = v; }} initial={filters.collects[c]} />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
    </Box>
  );
}
