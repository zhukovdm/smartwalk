import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Link,
  Rating,
  Stack,
  Typography
} from "@mui/material";
import {
  AccessTime,
  Home,
  LocationOn,
  Mail,
  OpenInNew,
  Payment,
  Phone,
  Toll
} from "@mui/icons-material";
import Image from "mui-image";
import { AppContext } from "../../App";
import {
  ExtendedPlace,
  PlaceAddress,
  EntityPayment,
  StoredPlace
} from "../../domain/types";
import { point2text } from "../../utils/helpers";
import { useAppSelector } from "../../features/hooks";
import ExtraChip from "./ExtraChip";
import ExtraArray from "./ExtraArray";
import SaveEntityDialog from "./SaveEntityDialog";

type EntityContentProps = {

  /** An entity contained in the panel. */
  entity: ExtendedPlace;
};

/**
 * Component showing all available information about the passed entity.
 */
export default function EntityContent({ entity }: EntityContentProps): JSX.Element {

  const { map } = useContext(AppContext);
  const { places } = useAppSelector((state) => state.favourites);

  const [saveDialog, setSaveDialog] = useState(false);
  const [found, setFound] = useState<StoredPlace | undefined>(undefined);

  const {
    polygon,
    image,
    description,
    address,
    payment,
    email,
    phone,
    website,
    charge,
    openingHours,
    fee,
    delivery,
    drinkingWater,
    internetAccess,
    shower,
    smoking,
    takeaway,
    toilets,
    wheelchair,
    rating,
    capacity,
    minimumAge,
    clothes,
    cuisine,
    rental
  } = entity.attributes;

  const composeAddress = ({ country, settlement, district, place, house, postalCode }: PlaceAddress) => {
    return [place, house, postalCode, district, settlement, country].filter((str) => !!str).join(", ");
  };

  const composePayment = ({ cash, card, amex, jcb, mastercard, visa, crypto }: EntityPayment) => {
    return [
      ["Cash", cash], ["Credit Card", card], ["Amex", amex], ["JCB", jcb],
      ["MasterCard", mastercard], ["Visa", visa], ["Crypto", crypto]
    ].filter(([_, value]) => value === true).map(([label, _]) => label);
  }

  useEffect(() => {
    setFound(places.find((p) => p.smartId === entity.smartId));
  }, [places, entity]);

  useEffect(() => {
    map?.clear();
    (found) ? map?.addStored(entity) : map?.addTagged(entity)
    if (polygon) { map?.drawPolygon(polygon); }
  }, [map, found, entity, polygon])

  const extra = [
    ["fee", fee], ["delivery", delivery], ["drinking water", drinkingWater], ["internet access", internetAccess],
    ["shower", shower], ["smoking", smoking], ["takeaway", takeaway], ["toilets", toilets], ["wheelchair", wheelchair]
  ].filter(([_, value]) => value !== undefined);

  const arr = (arr: any): boolean => arr && arr.length > 0;

  const pay = payment ? composePayment(payment) : [];

  const ico = address || website || phone || email || arr(pay) || arr(openingHours) || arr(charge);

  const add = rating || capacity || minimumAge || arr(cuisine) || arr(clothes) || arr(rental) || arr(extra);

  return (
    <Stack direction="column" gap={2.7}>
      {(found)
        ? <Alert severity="success">
            Saved as <strong>{found.name}</strong>.
          </Alert>
        : <Box>
            <Alert
              icon={false}
              severity="info"
              action={<Button color="inherit" size="small" onClick={() => { setSaveDialog(true); }}>Save</Button>}
            >
              Would you like to save this place?
            </Alert>
            {saveDialog && <SaveEntityDialog entity={entity} onHide={() => { setSaveDialog(false); }} />}
          </Box>
      }
      <Stack direction="column" gap={1}>
        <Typography fontSize="large">{entity.name}</Typography>
        <Divider sx={{ background: "lightgrey" }} />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="right"
          sx={{ cursor: "pointer" }}
          onClick={() => { map?.flyTo(entity); }}
        >
          <IconButton size="small"><LocationOn /></IconButton>
          <Typography fontSize="small">{point2text(entity.location)}</Typography>
        </Box>
      </Stack>
      <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={1}>
        {entity.keywords.map((k, i) => (
          <Chip key={i} label={k} color="primary" variant="outlined" sx={{ color: "black" }} />
        ))}
      </Stack>
      {(ico) &&
        <Stack direction="column" gap={1.5}>
          {address &&
            <Stack direction="row" columnGap={2}>
              <Home sx={{ color: "grey" }} titleAccess="Address" />
              <Typography noWrap>{composeAddress(address)}</Typography>
            </Stack>
          }
          {website &&
            <Stack direction="row" columnGap={2} alignItems="center">
              <OpenInNew sx={{ color: "grey" }} />
              <Link href={website} rel="noopener noreferrer" target="_blank" underline="none">
                <Typography>{website}</Typography>
              </Link>
            </Stack>
          }
          {phone &&
            <Stack direction="row" columnGap={2} alignItems="center">
              <Phone sx={{ color: "grey" }} />
              <Typography>{phone}</Typography>
            </Stack>
          }
          {email &&
            <Stack direction="row" columnGap={2} alignItems="center">
              <Mail sx={{ color: "grey" }} />
              <Link href={`mailto:${email}`} rel="noopener noreferrer" target="_top" underline="none">
                <Typography>{email}</Typography>
              </Link>
            </Stack>
          }
          {openingHours && openingHours.length > 0 &&
            <Stack direction="row" columnGap={2}>
              <AccessTime sx={{ color: "grey" }} titleAccess="opening hours" />
              <Stack direction="column" rowGap={1}>
                {openingHours.map((o, i) => (<Typography key={i}>{o}</Typography>))}
              </Stack>
            </Stack>
          }
          {pay.length > 0 &&
            <Stack direction="row" columnGap={2}>
              <Payment sx={{ color: "grey" }}  />
              <Typography>{pay.join(", ")}</Typography>
            </Stack>
          }
          {charge && charge.length > 0 &&
            <Stack direction="row" columnGap={2}>
              <Toll sx={{ color: "grey" }} titleAccess="toll" />
              <Stack direction="column" rowGap={1}>
                {charge.map((o, i) => (<Typography key={i}>{o}</Typography>))}
              </Stack>
            </Stack>
          }
        </Stack>
      }
      {(image) && (
        <Link href={image} rel="noopener noreferrer" target="_blank">
          <Image showLoading src={image} fit="contain" style={{ maxHeight: "300px" }}/>
        </Link>
      )}
      {(description) && (
        <Typography>{description}</Typography>
      )}
      {(add) && (
        <Divider sx={{ background: "lightgrey" }} />
      )}
      {(add) &&
        <Stack direction="column" gap={1}>
          <Typography fontSize="1.2rem">Additional information</Typography>
          {rating &&
            <Stack direction="row" gap={2}>
              <Typography>Rating:</Typography>
              <Rating value={rating} readOnly />
            </Stack>
          }
          {arr(cuisine) && (
            <ExtraArray label="cuisine" array={cuisine!} />
          )}
          {arr(clothes) && (
            <ExtraArray label="clothes" array={clothes!} />
          )}
          {arr(rental) && (
            <ExtraArray label="rental" array={rental!} />
          )}
          {arr(extra) &&
            <Stack direction="row" gap={0.5} flexWrap="wrap" sx={{ py: 0.5 }}>
              {capacity && (
                <ExtraChip label={`capacity ${capacity}`} />
              )}
              {minimumAge && (
                <ExtraChip label={`minimum age ${minimumAge}`} />
              )}
              {extra.map(([label, value], i) => (
                <ExtraChip key={i} label={`${value ? "" : "no "}${label}`} />
              ))}
            </Stack>
          }
        </Stack>
      }
    </Stack>
  );
}
