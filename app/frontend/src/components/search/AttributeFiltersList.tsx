import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
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
  AttributeFilters,
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

  /** Copy of the latest known filters */
  filters: AttributeFilters; // !

  /**
   * State-changing setter for `existen` attributes
   */
  onExistenUpdate: (attr: AttributeFilterExistenLabel, value: AttributeFilterExisten | undefined) => void;

  /**
   * State-changing setter for `boolean` attributes
   */
  onBooleanUpdate: (attr: AttributeFilterBooleanLabel, value: AttributeFilterBoolean | undefined) => void;

  /**
   * State-changing setter for `numeric` attributes
   */
  onNumericUpdate: (attr: AttributeFilterNumericLabel, value: AttributeFilterNumeric | undefined) => void;

  /**
   * State-changing setter for `textual` attributes
   */
  onTextualUpdate: (attr: AttributeFilterTextualLabel, value: AttributeFilterTextual | undefined) => void;

  /**
   * State-changing setter for `collect` attributes
   */
  onCollectUpdate: (attr: AttributeFilterCollectLabel, value: AttributeFilterCollect | undefined) => void;
};

/**
 * Renders five different types of attributes in a `type-unsafe` manner.
 * 
 * Note that object members of numeric and collect bounds can be undefined.
 * It is assumed that if a bound is associated with a keyword, then bound object
 * should have this object member as well. In particular, the property `bound`
 * for both AttributeFilterViewNumeric and AttributeFilterViewCollect is always
 * defined if the component is rendered.
 */
export default function AttributeFiltersList(props: AttributeFiltersListProps): JSX.Element {

  const {
    adviceItem,
    filters,
    onExistenUpdate,
    onBooleanUpdate,
    onNumericUpdate,
    onTextualUpdate,
    onCollectUpdate
  } = props;

  const {
    es: esAttrs,
    bs: bsAttrs,
    ns: nsAttrs,
    ts: tsAttrs,
    cs: csAttrs
  } = AttributeGrouper.group(adviceItem.attributeList);

  const [esExpanded, setEsExpanded] = useState(true);
  const [bsExpanded, setBsExpanded] = useState(true);
  const [nsExpanded, setNsExpanded] = useState(true);
  const [tsExpanded, setTsExpanded] = useState(true);
  const [csExpanded, setCsExpanded] = useState(true);

  return(
    <Box>
      {(esAttrs.length > 0) &&
        <Accordion
          expanded={esExpanded}
          onChange={(_, v) => { setEsExpanded(v); }}
        >
          <AccordionSummary
            id={"search-es-attributes-head"}
            aria-controls={"search-es-attributes-cont"}
            expandIcon={<ExpandSectionIcon expanded={esExpanded} />}
          >
            <Typography>Has</Typography>
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
              {esAttrs.map((e, i) => (
                <Box
                  key={i}
                  role={"listitem"}
                >
                  <AttributeFilterViewExisten
                    label={e}
                    value={(filters.es ?? {})[e]}
                    setter={(v) => { onExistenUpdate(e, v); }}
                  />
                </Box>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
      {(bsAttrs.length > 0) &&
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
              {bsAttrs.map((b, i) => (
                <Box
                  key={i}
                  role={"listitem"}
                >
                  <AttributeFilterViewBoolean
                    label={b}
                    value={(filters.bs ?? {})[b]}
                    setter={(v) => { onBooleanUpdate(b, v); }}
                  />
                </Box>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
      {(nsAttrs.length > 0) &&
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
              {nsAttrs.map((n, i) => (
                <Box
                  key={i}
                  role={"listitem"}
                  aria-label={camelCaseToLabel(n)}
                >
                  <AttributeFilterViewNumeric
                    label={n}
                    bound={((adviceItem.numericBounds)[n])!} // assumption!
                    value={(filters.ns ?? {})[n]}
                    setter={(v) => { onNumericUpdate(n, v); }}
                  />
                </Box>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
      {(tsAttrs.length > 0) &&
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
              {tsAttrs.map((t, i) => (
                <Box
                  key={i}
                  role={"listitem"}
                  aria-label={camelCaseToLabel(t)}
                >
                  <AttributeFilterViewTextual
                    label={t}
                    value={(filters.ts ?? {})[t]}
                    setter={(v) => { onTextualUpdate(t, v); }}
                  />
                </Box>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
      {(csAttrs.length > 0) &&
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
              {csAttrs.map((c, i) => (
                <Box
                  key={i}
                  role={"listitem"}
                  aria-label={camelCaseToLabel(c)}
                >
                  <AttributeFilterViewCollect
                    label={c}
                    bound={(adviceItem.collectBounds)[c]!}
                    value={(filters.cs ?? {})[c]}
                    setter={(v) => { onCollectUpdate(c, v); }}
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
