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
import AttributeFilterViewExisten from "./AttributeFilterViewExisten";
import AttributeFilterViewBoolean from "./AttributeFilterViewBoolean";
import AttributeFilterViewNumeric from "./AttributeFilterViewNumeric";
import AttributeFilterViewTextual from "./AttributeFilterViewTextual";
import AttributeFilterViewCollect from "./AttributeFilterViewCollect";

type AttributeFiltersListProps = {

  /** Autocomplete confguration for a particular word. */
  adviceItem: KeywordAdviceItem;

  /** Latest known filters. */
  filters: any; // !
};

/**
 * Renders five different types of attributes in a `type-unsafe` manner.
 */
export default function AttributeFiltersList({ adviceItem, filters }: AttributeFiltersListProps): JSX.Element {

  const expandIcon = <ExpandMore />

  const { bounds } = useAppSelector((state) => state.panel);
  const {
    es,
    bs,
    ns,
    ts,
    cs
  } = KeywordAdviceAttributes.group(adviceItem.attributeList);

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
                <AttributeFilterViewExisten
                  key={i}
                  initial={(filters.es ?? {})[e]}
                  label={e}
                  setter={(v) => { filters.es = filters.es ?? {}; filters.es[e] = v; }}
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
                <AttributeFilterViewBoolean
                  key={i}
                  initial={(filters.bs ?? {})[b]}
                  label={b}
                  setter={(v) => { filters.bs = filters.bs ?? {}; filters.bs[b] = v; }}
                />
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
              {ns.map((attr, i) => (
                <AttributeFilterViewNumeric
                  key={i}
                  initial={(filters.ns ?? {})[attr]}
                  label={attr}
                  setter={(v) => { filters.ns = filters.ns ?? {}; (filters.ns)[attr] = v; }}
                />
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
            <Stack spacing={1}>
              {ts.map((attr, i) => (
                <AttributeFilterViewTextual
                  key={i}
                  initial={(filters.ts ?? {})[attr]}
                  label={attr}
                  setter={(v) => { filters.ts = filters.ts ?? {}; filters.ts[attr] = v; }}
                />
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
            <Stack spacing={2}>
              {cs.map((attr, i) => (
                <AttributeFilterViewCollect
                  key={i}
                  initial={(filters.cs ?? {})[attr]}
                  label={attr}
                  setter={(v) => { filters.cs = filters.cs ?? {}; filters.cs[attr] = v; }}
                />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
    </Box>
  );
}
