type PlaceAttributes = {
  [key: string]: any;
};

type Collects = {
  [key in CollectLabel]?: Set<string>;
};

type Numerics = {
  [key in NumericLabel]?: NumericBound;
};

type Place = {
  keywords: string[];
  attributes: PlaceAttributes;
};

type NumericBound = {
  min: number;
  max: number;
};

type NumericLabel = "capacity" | "elevation" | "minimumAge" | "rating" | "year";

type CollectLabel = "clothes" | "cuisine" | "denomination" | "payment" | "rental";

type Item = {
  keyword: string;
  count: number;
  attributeList: Set<string>;
  numerics: Numerics;
  collects: Collects;
};
