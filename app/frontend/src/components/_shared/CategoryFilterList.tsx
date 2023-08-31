import Stack from "@mui/material/Stack";
import { PlaceCategory } from "../../domain/types";
import CategoryFilter from "./CategoryFilter";

type CategoryFilterListProps = {

  /** Configured categories */
  categories: PlaceCategory[];

  /** Is category active/shown in the list? */
  filterList: boolean[];

  /**
   * Predicate showing whether a category has at least one place
   * in the result.
   */
  found: (index: number) => boolean;

  /** Show category */
  onToggle: (index: number) => void;
};

export default function CategoryFilterList(
  { categories, filterList, found, onToggle }: CategoryFilterListProps): JSX.Element {

  return (
    <Stack
      role={"list"}
      aria-label={"Category filters"}
      direction={"row"}
      flexWrap={"wrap"}
      columnGap={1.5}
    >
      {categories.map((c, i) => (
        <CategoryFilter
          key={i}
          active={filterList[i]}
          index={i}
          category={c}
          found={found(i)}
          onToggle={onToggle}
        />
      ))}
    </Stack>
  );
}
