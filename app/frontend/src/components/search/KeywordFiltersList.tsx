import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { KeywordAdviceItem } from "../../domain/types";
import { KeywordAdviceAttributes } from "../../utils/helpers";
import { useAppSelector } from "../../features/storeHooks";
import KeywordFilterViewExisten from "./KeywordFilterViewExisten";
import KeywordFilterViewBoolean from "./KeywordFilterViewBoolean";
import KeywordFilterViewNumeric from "./KeywordFilterViewNumeric";
import KeywordFilterViewTextual from "./KeywordFilterViewTextual";
import KeywordFilterViewCollect from "./KeywordFilterViewCollect";

type KeywordAttributeListProps = {

  /** Autocomplete confguration for a particular word. */
  adviceItem: KeywordAdviceItem;

  /** Latest known filters. */
  filters: any; // (!)
};

/**
 * Renders five different types of attributes in a `type-unsafe` manner.
 */
export default function KeywordFilterList({ adviceItem, filters }: KeywordAttributeListProps): JSX.Element {

  const expandIcon = <ExpandMore />

  const { bounds } = useAppSelector((state) => state.panel);
  const { es, bs, ns, ts, cs } = KeywordAdviceAttributes.group(adviceItem.attributeList);

  return(
    <Box>
      {(es.length > 0) &&
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={expandIcon}>
            <Typography>Should have</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack
              direction={"row"}
              display={"flex"}
              flexWrap={"wrap"}
              justifyContent={"center"}
              spacing={1}
            >
              {es.map((e, i) => (
                <KeywordFilterViewExisten
                  key={i}
                  label={e}
                  setter={(v) => { filters.es = filters.es ?? {}; filters.es[e] = v; }}
                  initial={(filters.es ?? {})[e]}
                />
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
                <KeywordFilterViewBoolean
                  key={i}
                  label={b}
                  setter={(v) => { filters.bs = filters.bs ?? {}; filters.bs[b] = v; }}
                  initial={(filters.bs ?? {})[b]} />
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
                <KeywordFilterViewNumeric
                  key={i}
                  label={n}
                  setter={(v) => { filters.ns = filters.ns ?? {}; (filters.ns)[n] = v; }}
                  initial={(filters.ns ?? {})[n]} />
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
                <KeywordFilterViewTextual
                  key={i}
                  label={t}
                  setter={(v) => { filters.ts = filters.ts ?? {}; filters.ts[t] = v; }}
                  initial={(filters.ts ?? {})[t]} />
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
                <KeywordFilterViewCollect
                  key={i}
                  label={c}
                  setter={(v) => { filters.cs = filters.cs ?? {}; filters.cs[c] = v; }}
                  initial={(filters.cs ?? {})[c]} />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
    </Box>
  );
}
