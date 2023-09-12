type PlaceAttributes = {
  [key: string]: any;
};

type Place = {
  keywords: string[];
  attributes: PlaceAttributes;
};

type NumericBoundLabel = "capacity" | "elevation" | "minimumAge" | "rating" | "year";

type CollectBoundLabel = "clothes" | "cuisine" | "denomination" | "payment" | "rental";

type NumericBound = {
  min: number;
  max: number;
};

type CollectBounds = {
  [key in CollectBoundLabel]?: Set<string>;
};

type NumericBounds = {
  [key in NumericBoundLabel]?: NumericBound;
};

type Item = {
  keyword: string;
  count: number;
  attributeList: Set<string>;
  numericBounds: NumericBounds;
  collectBounds: CollectBounds;
};
