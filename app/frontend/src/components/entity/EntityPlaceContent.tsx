import { useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
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
import {
  useAppDispatch,
  useAppSelector
} from "../../features/storeHooks";
import {
  createFavoritePlace
} from "../../features/favoritesSlice";
import {
  appendSearchDirecsPlace
} from "../../features/searchDirecsSlice";
import { IdGenerator } from "../../utils/helpers";
import SomethingActionMenu from "../shared/SomethingActionMenu";
import SaveSomethingDialog from "../shared/SomethingSaveDialog";
import PlaceLocation from "../shared/PlaceLocation";
import PlaceKeywords from "../shared/PlaceKeywords";
import AppendPlaceDialog from "../shared/PlaceAppendDialog";
import ExtraChip from "./ExtraChip";
import ExtraArray from "./ExtraArray";

type PlaceContentProps = {

  /** An extended place contained in the panel. */
  place: ExtendedPlace;
};

/**
 * Component showing all available information about the passed place.
 */
export default function PlaceContent({ place }: PlaceContentProps): JSX.Element {

  const { map, storage } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const { places } = useAppSelector((state) => state.favorites);

  const [showA, setShowA] = useState(false);
  const [showS, setShowS] = useState(false);

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

  const onSave = async (name: string) => {

    const p = {
      name: name,
      location: place.location,
      keywords: place.keywords,
      categories: []
    };
    const s = {
      ...p,
      smartId: place.smartId,
      placeId: IdGenerator.generateId(p)
    };
    await storage.createPlace(s);
    dispatch(createFavoritePlace(s));
  };

  const onAppend = () => {
    const { smartId, name, location, keywords } = place;
    const p = storedPlace ?? {
      smartId: smartId,
      name: name,
      location: location,
      keywords: keywords,
      categories: []
    };
    dispatch(appendSearchDirecsPlace(p));
  };

  return (
    <Stack direction={"column"} gap={2.5}>
      {
        /* header */
      }
      <Stack direction={"column"} gap={1}>
        <Typography
          fontSize={"1.25rem"}
          fontWeight={"medium"}
        >
          {place.name}
        </Typography>
        <Divider sx={{ background: "lightgrey" }} />
        <PlaceLocation
          map={map}
          place={place}
          isStored={!!storedPlace}
        />
      </Stack>
      <PlaceKeywords keywords={place.keywords} />
      {
        /* actions */
      }
      {(!!storedPlace)
        ? <Alert
            icon={false}
            severity={"success"}
            action={
              <SomethingActionMenu
                showAppendDialog={() => { setShowA(true); }}
              />
            }
          >
            Saved as <strong>{storedPlace.name}</strong>.
          </Alert>
        : <Alert
            icon={false}
            severity={"info"}
            action={
              <SomethingActionMenu
                showSaveDialog={() => { setShowS(true); }}
                showAppendDialog={() => { setShowA(true); }}
              />
            }
          >
            This place is not in your Favorites yet.
          </Alert>
      }
      <SaveSomethingDialog
        name={place.name}
        show={showS}
        what={"place"}
        onHide={() => { setShowS(false); }}
        onSave={onSave}
      />
      <AppendPlaceDialog
        show={showA}
        onHide={() => { setShowA(false); }}
        onAppend={onAppend}
      />
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