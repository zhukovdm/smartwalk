import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  AttributeFilterNumeric,
  KeywordAdviceItem
} from "../../domain/types";
import { camelCaseToLabel } from "../../utils/functions";
import AttributeGrouper from "../../utils/attributeGrouper";
import ExpandSectionIcon from "../_shared/ExpandSectionIcon";
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
export default function AttributeFiltersList(
  { adviceItem, filters }: AttributeFiltersListProps): JSX.Element {

  const {
    es,
    bs,
    ns,
    ts,
    cs
  } = AttributeGrouper.group(adviceItem.attributeList);

  const [esExpanded, setEsExpanded] = useState(true);
  const [bsExpanded, setBsExpanded] = useState(true);
  const [nsExpanded, setNsExpanded] = useState(true);
  const [tsExpanded, setTsExpanded] = useState(true);
  const [csExpanded, setCsExpanded] = useState(true);

  return(
    <Box>
      {(es.length > 0) &&
        <Accordion
          expanded={esExpanded}
          onChange={(_, v) => { setEsExpanded(v); }}
        >
          <AccordionSummary
            id={"search-es-attributes-head"}
            aria-controls={"search-es-attributes-cont"}
            expandIcon={<ExpandSectionIcon expanded={esExpanded} />}
          >
            <Typography>Should have</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack
              direction={"row"}
              display={"flex"}
              flexWrap={"wrap"}
              justifyContent={"center"}
              columnGap={1}
              role={"list"}
              aria-labelledby={"search-es-attributes-head"}
            >
              {es.map((e, i) => (
                <Box
                  key={i}
                  role={"listitem"}
                >
                  <AttributeFilterViewExisten
                    initial={(filters.es ?? {})[e]}
                    label={e}
                    setter={(v) => { filters.es = filters.es ?? {}; filters.es[e] = v; }}
                  />
                </Box>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
      {(bs.length > 0) &&
        <Accordion
          expanded={bsExpanded}
          onChange={(_, v) => { setBsExpanded(v); }}
        >
          <AccordionSummary
            id={"search-bs-attributes-head"}
            aria-controls={"search-bs-attributes-cont"}
            expandIcon={<ExpandSectionIcon expanded={bsExpanded} />}
          >
            <Typography>Yes / No</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack
              rowGap={1}
              role={"list"}
              aria-labelledby={"search-bs-attributes-head"}
            >
              {bs.map((b, i) => (
                <Box
                  key={i}
                  role={"listitem"}
                >
                  <AttributeFilterViewBoolean
                    initial={(filters.bs ?? {})[b]}
                    label={b}
                    setter={(v) => { filters.bs = filters.bs ?? {}; filters.bs[b] = v; }}
                  />
                </Box>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
      {(ns.length > 0) &&
        <Accordion
          expanded={nsExpanded}
          onChange={(_, v) => { setNsExpanded(v); }}
        >
          <AccordionSummary
            id={"search-ns-attributes-head"}
            aria-controls={"search-ns-attributes-cont"}
            expandIcon={<ExpandSectionIcon expanded={nsExpanded} />}
          >
            <Typography>Numeric</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack
              rowGap={2.5}
              role={"list"}
              aria-labelledby={"search-ns-attributes-head"}
            >
              {ns.map((attr, i) => (
                <Box
                  key={i}
                  role={"listitem"}
                  aria-label={camelCaseToLabel(attr)}
                >
                  <AttributeFilterViewNumeric
                    bound={(adviceItem.bounds as any)[attr] as AttributeFilterNumeric}
                    initial={(filters.ns ?? {})[attr]}
                    label={attr}
                    setter={(v) => { filters.ns = filters.ns ?? {}; (filters.ns)[attr] = v; }}
                  />
                </Box>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
      {(ts.length > 0) &&
        <Accordion
          expanded={tsExpanded}
          onChange={(_, v) => { setTsExpanded(v); }}
        >
          <AccordionSummary
            id={"search-ts-attributes-head"}
            aria-controls={"search-ts-attributes-cont"}
            expandIcon={<ExpandSectionIcon expanded={tsExpanded} />}
          >
            <Typography>Contains text</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack
              rowGap={1}
              role={"list"}
              aria-labelledby={"search-ts-attributes-head"}
            >
              {ts.map((attr, i) => (
                <Box
                  key={i}
                  role={"listitem"}
                  aria-label={camelCaseToLabel(attr)}
                >
                  <AttributeFilterViewTextual
                    initial={(filters.ts ?? {})[attr]}
                    label={attr}
                    setter={(v) => { filters.ts = filters.ts ?? {}; filters.ts[attr] = v; }}
                  />
                </Box>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
      {(cs.length > 0) &&
        <Accordion
          expanded={csExpanded}
          onChange={(_, v) => { setCsExpanded(v); }}
        >
          <AccordionSummary
            id={"search-cs-attributes-head"}
            aria-controls={"search-cs-attributes-cont"}
            expandIcon={<ExpandSectionIcon expanded={csExpanded} />}
          >
            <Typography>Include any / Exclude all</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack
              rowGap={2}
              role={"list"}
              aria-labelledby={"search-cs-attributes-head"}
            >
              {cs.map((attr, i) => (
                <Box
                  key={i}
                  role={"listitem"}
                  aria-label={camelCaseToLabel(attr)}
                >
                  <AttributeFilterViewCollect
                    bound={(adviceItem.bounds as any)[attr] as string[]}
                    initial={(filters.cs ?? {})[attr]}
                    label={attr}
                    setter={(v) => { filters.cs = filters.cs ?? {}; filters.cs[attr] = v; }}
                  />
                </Box>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
    </Box>
  );
}
