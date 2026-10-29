type PlaceAttributes = {
  [key: string]: any;
};

export type Place = {
  keywords: string[];
  attributes: PlaceAttributes;
};

export type NumericBoundLabel = "capacity" | "elevation" | "minimumAge" | "rating" | "year";

export type CollectBoundLabel = "clothes" | "cuisine" | "denomination" | "payment" | "rental";

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

export type Item = {
  keyword: string;
  count: number;
  attributeList: Set<string>;
  numericBounds: NumericBounds;
  collectBounds: CollectBounds;
};
