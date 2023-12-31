import Stack from "@mui/material/Stack";
import { PlaceCategory } from "../../domain/types";
import CategoryFilter from "./CategoryFilter";

export type CategoryFilterListProps = {

  /** Configured categories */
  categories: PlaceCategory[];

  /** Is category shown in the list? */
  filterList: boolean[];

  /**
   * Predicate showing whether a category has at least one place
   * in the result.
   */
  found: (index: number) => boolean;

  /** Show category */
  onToggle: (index: number) => void;
};

/**
 * List of categories presented to the user.
 */
export default function CategoryFilterList(
  { categories, filterList, found, onToggle }: CategoryFilterListProps): JSX.Element {

  return (
    <Stack
      role={"list"}
      aria-label={"Category filters"}
      rowGap={0.75}
      columnGap={1.5}
      direction={"row"}
      flexWrap={"wrap"}
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
