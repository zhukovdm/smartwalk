import { useCallback, useState } from "react";
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
import {
  type ExtendedPlace,
  type PlaceAddress
} from "../../domain/types";
import IdGenerator from "../../utils/idGenerator";
import { createFavoritePlace } from "../../features/favoritesSlice";
import { appendSearchDirecsPlace } from "../../features/searchDirecsSlice";
import { useExtendedPlaceMap } from "../../features/entityHooks";
import { useAppDispatch } from "../../features/storeHooks";
import PlaceAppendDialog from "../_shared/PlaceAppendDialog";
import PlaceLocation from "../_shared/PlaceLocation";
import PlaceKeywords from "../_shared/PlaceKeywords";
import SomethingActionMenu from "../_shared/SomethingActionMenu";
import PlaceSaveDialog from "../_shared/PlaceSaveDialog";
import ExtraChip from "./ExtraChip";
import ExtraArray from "./ExtraArray";
import EntityPlaceHelmet from "./EntityPlaceHelmet";

export type EntityPlaceContentProps = {

  /** Extended place representation */
  place: ExtendedPlace;
};

/**
 * Component showing all available information about the passed place.
 */
export default function EntityPlaceContent({ place }: EntityPlaceContentProps): JSX.Element {

  const dispatch = useAppDispatch();

  const [showA, setShowA] = useState(false);
  const [showS, setShowS] = useState(false);

  const {
    name,
    attributes
  } = place;

  const {
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
  } = attributes;

  const composeAddress = ({ country, settlement, district, place, house, postalCode }: PlaceAddress) => (
    [place, house, postalCode, district, settlement, country].filter((str) => !!str).join(", "));

  const { map, storage, storedPlace } = useExtendedPlaceMap(place);
  const isNonEmptyArray = useCallback((arr: any): boolean => (Array.isArray(arr) && arr.length > 0), []);

  const booleanChips = [
    ["fee", fee],
    ["delivery", delivery],
    ["drinking water", drinkingWater],
    ["internet access", internetAccess],
    ["shower", shower],
    ["smoking", smoking],
    ["takeaway", takeaway],
    ["toilets", toilets],
    ["wheelchair", wheelchair]
  ].filter(([_, value]) => value !== undefined);

  const sectionWithIcons = address
    || website
    || phone
    || email
    || socialNetworks
    || isNonEmptyArray(openingHours)
    || isNonEmptyArray(charge);

  const sectionWithFacts = isNonEmptyArray(booleanChips)
    || capacity !== undefined
    || elevation !== undefined
    || minimumAge !== undefined
    || year !== undefined;
  
  const sectionWithAdditionalInformation = rating !== undefined
    || isNonEmptyArray(cuisine)
    || isNonEmptyArray(clothes)
    || isNonEmptyArray(denomination)
    || isNonEmptyArray(payment)
    || isNonEmptyArray(rental)
    || sectionWithFacts;

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
        /* helmet */
      }
      <EntityPlaceHelmet
        place={place}
        url={window.location.href}
      />
      {
        /* header */
      }
      <Stack direction={"column"} gap={1}>
        <Typography
          fontSize={"1.25rem"}
          fontWeight={"medium"}
        >
          {name}
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
      <PlaceSaveDialog
        key={name}
        name={name}
        show={showS}
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
      {(sectionWithIcons) &&
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
              <Typography>{composeAddress(address)}</Typography>
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
                titleAccess={"Website"}
              />
              <Typography
                noWrap={true}
                sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                <Link
                  href={website}
                  rel={"noopener noreferrer"}
                  target={"_blank"}
                  underline={"none"}
                >
                  {website}
                </Link>
              </Typography>
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
              <Typography
                noWrap={true}
                sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                <Link
                  href={`tel:${phone}`}
                  rel={"noopener noreferrer"}
                  target={"_top"}
                  underline={"none"}
                >
                  {phone}
                </Link>
              </Typography>
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
              <Typography
                noWrap={true}
                sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                <Link
                  href={`mailto:${email}`}
                  rel={"noopener noreferrer"}
                  target={"_top"}
                  underline={"none"}
                >
                  {email}
                </Link>
              </Typography>
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
          {(!!openingHours) && isNonEmptyArray(openingHours) &&
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
                {openingHours.map((o, i) => (<Typography key={i}>{o}</Typography>))}
              </Stack>
            </Stack>
          }
          {(!!charge) && isNonEmptyArray(charge) &&
            <Stack
              direction="row"
              columnGap={2}
              role={"region"}
              aria-label={"Charge"}
            >
              <TollIcon
                aria-hidden
                className={"entity-place"}
                titleAccess={"Charge"}
              />
              <Stack direction="column" rowGap={1}>
                {charge.map((o, i) => (<Typography key={i}>{o}</Typography>))}
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
      {(sectionWithAdditionalInformation) &&
        <Divider sx={{ background: "lightgrey" }} />
      }
      {(sectionWithAdditionalInformation) &&
        <Stack direction={"column"} gap={1}>
          <Typography fontSize={"1.2rem"}>Additional information</Typography>
          {(rating !== undefined) &&
            <Stack
              role={"region"}
              direction={"row"}
              gap={2}
              aria-label={"Rating"}
            >
              <Typography>Rating:</Typography>
              <Rating value={rating} readOnly={true} />
            </Stack>
          }
          {(!!clothes) && isNonEmptyArray(clothes) &&
            <ExtraArray label={"clothes"} array={clothes} />
          }
          {(!!cuisine) && isNonEmptyArray(cuisine) && 
            <ExtraArray label={"cuisine"} array={cuisine} />
          }
          {(!!denomination) && isNonEmptyArray(denomination) &&
            <ExtraArray label={"denomination"} array={denomination} />
          }
          {(!!payment) && isNonEmptyArray(payment) &&
            <ExtraArray label={"payment"} array={payment} />
          }
          {(!!rental) && isNonEmptyArray(rental) && (
            <ExtraArray label={"rental"} array={rental} />
          )}
          {(sectionWithFacts) &&
            <Stack
              direction={"row"}
              gap={0.5}
              flexWrap={"wrap"}
              sx={{ py: 0.5 }}
              role={"region"}
              aria-label={"Facts"}
            >
              {(capacity !== undefined) &&
                <ExtraChip label={`capacity ${capacity}`} />
              }
              {(elevation !== undefined) &&
                <ExtraChip label={`elevation ${elevation}`} />
              }
              {(minimumAge !== undefined) &&
                <ExtraChip label={`minimum age ${minimumAge}`} />
              }
              {(year !== undefined) &&
                <ExtraChip label={`year ${year}`} />
              }
              {booleanChips.map(([label, value], i) => (
                <ExtraChip key={i} label={`${value ? "" : "no "}${label}`} />
              ))}
            </Stack>
          }
        </Stack>
      }
    </Stack>
  );
}
