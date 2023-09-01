import { useContext, useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FacebookIcon from "@mui/icons-material/Facebook";
import HomeIcon from "@mui/icons-material/Home";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MailIcon from "@mui/icons-material/Mail";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PhoneIcon from "@mui/icons-material/Phone";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TelegramIcon from "@mui/icons-material/Telegram";
import TollIcon from "@mui/icons-material/Toll";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Image from "mui-image";
import { AppContext } from "../../App";
import {
  ExtendedPlace,
  PlaceAddress
} from "../../domain/types";
import IdGenerator from "../../utils/idGenerator";
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
import SomethingActionMenu from "../_shared/SomethingActionMenu";
import SomethingSaveDialog from "../_shared/SomethingSaveDialog";
import PlaceLocation from "../_shared/PlaceLocation";
import PlaceKeywords from "../_shared/PlaceKeywords";
import PlaceAppendDialog from "../_shared/PlaceAppendDialog";
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
      <SomethingSaveDialog
        name={place.name}
        show={showS}
        what={"place"}
        onHide={() => { setShowS(false); }}
        onSave={onSave}
      />
      <PlaceAppendDialog
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
            <Stack
              direction={"row"}
              columnGap={2}
              role={"region"}
              aria-label={"Address"}
            >
              <HomeIcon
                aria-hidden
                className={"entity-place"}
                titleAccess={"Address"}
              />
              <Typography noWrap>{composeAddress(address)}</Typography>
            </Stack>
          }
          {website &&
            <Stack
              direction={"row"}
              columnGap={2}
              alignItems={"center"}
            >
              <OpenInNewIcon
                aria-hidden
                className={"entity-place"}
                titleAccess={"Webpage"}
              />
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
            <Stack
              direction={"row"}
              columnGap={2}
              alignItems={"center"}
            >
              <PhoneIcon
                aria-hidden
                className={"entity-place"}
                titleAccess={"Phone number"}
              />
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
            <Stack
              direction={"row"}
              columnGap={2}
              alignItems={"center"}
            >
              <MailIcon
                aria-hidden
                className={"entity-place"}
                titleAccess={"Email"}
              />
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
            <Stack
              direction={"row"}
              flexWrap={"wrap"}
              gap={1}
              justifyContent={"center"}
              alignItems={"center"}
              role={"region"}
              aria-label={"Social networks"}
            >
              {socialNetworks.facebook &&
                <Link
                  rel={"noopener noreferrer"}
                  target={"_blank"}
                  href={socialNetworks.facebook}
                  aria-label={socialNetworks.facebook}
                >
                  <FacebookIcon
                    aria-hidden
                    titleAccess={"Facebook profile"}
                  />
                </Link>
              }
              {socialNetworks.instagram &&
                <Link
                  rel={"noopener noreferrer"}
                  target={"_blank"}
                  href={socialNetworks.instagram}
                  aria-label={socialNetworks.instagram}
                >
                  <InstagramIcon
                    aria-hidden
                    titleAccess={"Instagram profile"}
                  />
                </Link>
              }
              {socialNetworks.linkedin &&
                <Link
                  rel={"noopener noreferrer"}
                  target={"_blank"}
                  href={socialNetworks.linkedin}
                  aria-label={socialNetworks.linkedin}
                >
                  <LinkedInIcon
                    aria-hidden
                    titleAccess={"LinkedIn profile"}
                  />
                </Link>
              }
              {socialNetworks.pinterest &&
                <Link
                  rel={"noopener noreferrer"}
                  target={"_blank"}
                  href={socialNetworks.pinterest}
                  aria-label={socialNetworks.pinterest}
                >
                  <PinterestIcon
                    aria-hidden
                    titleAccess={"Pinterest profile"}
                  />
                </Link>
              }
              {socialNetworks.telegram &&
                <Link
                  rel={"noopener noreferrer"}
                  target={"_blank"}
                  href={socialNetworks.telegram}
                  aria-label={socialNetworks.telegram}
                >
                  <TelegramIcon
                    aria-hidden
                    titleAccess={"Telegram profile"}
                  />
                </Link>
              }
              {socialNetworks.twitter &&
                <Link
                  rel={"noopener noreferrer"}
                  target={"_blank"}
                  href={socialNetworks.twitter}
                  aria-label={socialNetworks.twitter}
                >
                  <TwitterIcon
                    aria-hidden
                    titleAccess={"Twitter profile"}
                  />
                </Link>
              }
              {socialNetworks.youtube &&
                <Link
                  rel={"noopener noreferrer"}
                  target={"_blank"}
                  href={socialNetworks.youtube}
                  aria-label={socialNetworks.youtube}
                >
                  <YouTubeIcon
                    aria-hidden
                    titleAccess={"YouTube profile"}
                  />
                </Link>
              }
            </Stack>
          }
          {arr(openingHours) &&
            <Stack
              direction={"row"}
              columnGap={2}
              role={"region"}
              aria-label={"Opening hours"}
            >
              <AccessTimeIcon
                aria-hidden
                className={"entity-place"}
                titleAccess={"Opening hours"}
              />
              <Stack direction={"column"} rowGap={1}>
                {openingHours!.map((o, i) => (<Typography key={i}>{o}</Typography>))}
              </Stack>
            </Stack>
          }
          {arr(charge) &&
            <Stack
              direction="row"
              columnGap={2}
              role={"region"}
              aria-label={"Toll"}
            >
              <TollIcon
                aria-hidden
                className={"entity-place"}
                titleAccess={"Toll"}
              />
              <Stack direction="column" rowGap={1}>
                {charge!.map((o, i) => (<Typography key={i}>{o}</Typography>))}
              </Stack>
            </Stack>
          }
        </Stack>
      }
      {(image) &&
        <Link
          href={image}
          rel={"noopener noreferrer"}
          target={"_blank"}
          aria-label={"Image as an external resource"}
        >
          <Image
            fit={"contain"}
            showLoading={true}
            src={image}
            style={{ maxHeight: "300px" }}
            alt={"image"}
          />
        </Link>
      }
      {(description) &&
        <Typography aria-label={"Description"}>
          {description}
        </Typography>
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
            <Stack
              direction={"row"}
              gap={0.5}
              flexWrap={"wrap"}
              sx={{ py: 0.5 }}
              role={"region"}
              aria-label={"facts"}
            >
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
