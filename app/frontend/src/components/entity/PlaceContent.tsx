import { useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Link,
  Rating,
  Stack,
  Typography
} from "@mui/material";
import {
  AccessTime,
  Facebook,
  Home,
  Instagram,
  LinkedIn,
  Mail,
  OpenInNew,
  Phone,
  Pinterest,
  Telegram,
  Toll,
  Twitter,
  YouTube
} from "@mui/icons-material";
import Image from "mui-image";
import { AppContext } from "../../App";
import {
  ExtendedPlace,
  PlaceAddress
} from "../../domain/types";
import { point2text } from "../../utils/helpers";
import { useAppSelector } from "../../features/storeHooks";
import { PlaceButton } from "../shared/_buttons";
import ExtraChip from "./ExtraChip";
import ExtraArray from "./ExtraArray";
import SavePlaceDialog from "./SavePlaceDialog";

type PlaceContentProps = {

  /** An extended place contained in the panel. */
  place: ExtendedPlace;
};

/**
 * Component showing all available information about the passed place.
 */
export default function PlaceContent({ place }: PlaceContentProps): JSX.Element {

  const { map } = useContext(AppContext);
  const { places } = useAppSelector((state) => state.favorites);

  const [showDialog, setShowDialog] = useState(false);

  const {
    polygon,
    description,
    image,
    website,
    address,
    email,
    phone,
    socialNetworks,
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
    capacity,
    elevation,
    minimumAge,
    rating,
    year,
    clothes,
    cuisine,
    denomination,
    payment,
    rental
  } = place.attributes;

  const composeAddress = ({ country, settlement, district, place, house, postalCode }: PlaceAddress) => (
    [place, house, postalCode, district, settlement, country].filter((str) => !!str).join(", "));

  const storedPlace = useMemo(() => (
    places.find((p) => p.smartId === place.smartId)), [place, places]);

  useEffect(() => {
    map?.clear();
    (storedPlace)
      ? map?.addStored(place, [])
      : map?.addCommon(place, [], false);
    if (polygon) {
      map?.drawPolygon(polygon);
    }
    map?.flyTo(place);
  }, [map, place, storedPlace, polygon])

  const extra = [
    ["fee", fee], ["delivery", delivery], ["drinking water", drinkingWater], ["internet access", internetAccess],
    ["shower", shower], ["smoking", smoking], ["takeaway", takeaway], ["toilets", toilets], ["wheelchair", wheelchair]
  ].filter(([_, value]) => value !== undefined);

  const arr = (arr: any): boolean => arr && arr.length > 0;

  const ico = address || website || phone || email || socialNetworks || arr(openingHours) || arr(charge);

  const add = rating || capacity || minimumAge || arr(cuisine) || arr(clothes) || arr(denomination) || arr(payment) || arr(rental) || arr(extra);

  return (
    <Stack direction={"column"} gap={2.5}>
      {
        /* dialog */
      }
      {(storedPlace)
        ? <Alert severity={"success"}>
            Saved as <strong>{storedPlace.name}</strong>.
          </Alert>
        : <Box>
            <Alert
              icon={false}
              severity={"info"}
              action={<Button color={"inherit"} size={"small"} onClick={() => { setShowDialog(true); }} title={"Save place"}>Save</Button>}
            >
              Would you like to save this place?
            </Alert>
            <SavePlaceDialog
              show={showDialog}
              place={place}
              onHide={() => { setShowDialog(false); }}
            />
          </Box>
      }
      {
        /* header */
      }
      <Stack direction={"column"} gap={1}>
        <Typography fontSize={"large"}>{place.name}</Typography>
        <Divider sx={{ background: "lightgrey" }} />
        <Box
          alignItems={"center"}
          display={"flex"}
          justifyContent={"right"}
          onClick={() => { map?.flyTo(place); }}
          sx={{ cursor: "pointer"}}
        >
          <PlaceButton
            kind={(!storedPlace) ? "common" : "stored"}
            title={"Fly to"}
            onPlace={() => {}}
          />
          <Typography fontSize={"small"}>{point2text(place.location)}</Typography>
        </Box>
      </Stack>
      <Stack
        direction={"row"}
        flexWrap={"wrap"}
        justifyContent={"center"}
        gap={1}
      >
        {place.keywords.map((k, i) => (
          <Chip key={i} label={k} color={"primary"} variant={"outlined"} sx={{ color: "black" }} />
        ))}
      </Stack>
      {
        /* contacts */
      }
      {(ico) &&
        <Stack direction={"column"} gap={1.5}>
          {address &&
            <Stack direction={"row"} columnGap={2}>
              <Home sx={{ color: "grey" }} titleAccess={"address"} />
              <Typography noWrap>{composeAddress(address)}</Typography>
            </Stack>
          }
          {website &&
            <Stack direction={"row"} columnGap={2} alignItems={"center"}>
              <OpenInNew sx={{ color: "grey" }} titleAccess={"webpage"} />
              <Link
                href={website}
                rel={"noopener noreferrer"}
                target={"_blank"}
                underline={"none"}
              >
                <Typography>{website}</Typography>
              </Link>
            </Stack>
          }
          {phone &&
            <Stack direction={"row"} columnGap={2} alignItems={"center"}>
              <Phone sx={{ color: "grey" }} titleAccess={"phone number"} />
              <Link
                href={`tel:${phone}`}
                rel={"noopener noreferrer"}
                target={"_top"}
                underline={"none"}
              >
                <Typography>{phone}</Typography>
              </Link>
            </Stack>
          }
          {email &&
            <Stack direction={"row"} columnGap={2} alignItems={"center"}>
              <Mail sx={{ color: "grey" }} titleAccess={"email"} />
              <Link
                href={`mailto:${email}`}
                rel={"noopener noreferrer"}
                target={"_top"}
                underline={"none"}
              >
                <Typography>{email}</Typography>
              </Link>
            </Stack>
          }
          {socialNetworks &&
            <Stack direction={"row"} flexWrap={"wrap"} gap={1} justifyContent={"center"}>
              {socialNetworks.facebook &&
                <Link href={socialNetworks.facebook} rel={"noopener noreferrer"} target={"_blank"}>
                  <Facebook />
                </Link>
              }
              {socialNetworks.instagram &&
                <Link href={socialNetworks.instagram} rel={"noopener noreferrer"} target={"_blank"}>
                  <Instagram />
                </Link>
              }
              {socialNetworks.linkedin &&
                <Link href={socialNetworks.linkedin} rel={"noopener noreferrer"} target={"_blank"}>
                  <LinkedIn />
                </Link>
              }
              {socialNetworks.pinterest &&
                <Link href={socialNetworks.pinterest} rel={"noopener noreferrer"} target={"_blank"}>
                  <Pinterest />
                </Link>
              }
              {socialNetworks.telegram &&
                <Link href={socialNetworks.telegram} rel={"noopener noreferrer"} target={"_blank"}>
                  <Telegram />
                </Link>
              }
              {socialNetworks.twitter &&
                <Link href={socialNetworks.twitter} rel={"noopener noreferrer"} target={"_blank"}>
                  <Twitter />
                </Link>
              }
              {socialNetworks.youtube &&
                <Link href={socialNetworks.youtube} rel={"noopener noreferrer"} target={"_blank"}>
                  <YouTube />
                </Link>
              }
            </Stack>
          }
          {arr(openingHours) &&
            <Stack direction={"row"} columnGap={2}>
              <AccessTime sx={{ color: "grey" }} titleAccess={"opening hours"} />
              <Stack direction={"column"} rowGap={1}>
                {openingHours!.map((o, i) => (<Typography key={i}>{o}</Typography>))}
              </Stack>
            </Stack>
          }
          {arr(charge) &&
            <Stack direction="row" columnGap={2}>
              <Toll sx={{ color: "grey" }} titleAccess={"toll"} />
              <Stack direction="column" rowGap={1}>
                {charge!.map((o, i) => (<Typography key={i}>{o}</Typography>))}
              </Stack>
            </Stack>
          }
        </Stack>
      }
      {(image) &&
        <Link href={image} rel={"noopener noreferrer"} target={"_blank"}>
          <Image
            fit={"contain"}
            showLoading={true}
            src={image}
            style={{ maxHeight: "300px" }}
          />
        </Link>
      }
      {(description) &&
        <Typography>{description}</Typography>
      }
      {(add) && 
        <Divider sx={{ background: "lightgrey" }} />
      }
      {(add) &&
        <Stack direction={"column"} gap={1}>
          <Typography fontSize={"1.2rem"}>Additional information</Typography>
          {rating &&
            <Stack direction={"row"} gap={2}>
              <Typography>Rating:</Typography>
              <Rating value={rating} readOnly={true} />
            </Stack>
          }
          {arr(clothes) &&
            <ExtraArray label={"clothes"} array={clothes!} />
          }
          {arr(cuisine) && 
            <ExtraArray label={"cuisine"} array={cuisine!} />
          }
          {arr(denomination) &&
            <ExtraArray label={"denomination"} array={denomination!} />
          }
          {arr(payment) &&
            <ExtraArray label={"payment"} array={payment!} />
          }
          {arr(rental) && (
            <ExtraArray label={"rental"} array={rental!} />
          )}
          {arr(extra) &&
            <Stack direction="row" gap={0.5} flexWrap="wrap" sx={{ py: 0.5 }}>
              {capacity &&
                <ExtraChip label={`capacity ${capacity}`} />
              }
              {elevation &&
                <ExtraChip label={`elevation ${elevation}`} />
              }
              {minimumAge &&
                <ExtraChip label={`minimum age ${minimumAge}`} />
              }
              {year &&
                <ExtraChip label={`year ${year}`} />
              }
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
