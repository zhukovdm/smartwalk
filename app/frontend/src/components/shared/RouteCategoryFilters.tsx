import Stack from "@mui/material/Stack";
import { PlaceCategory } from "../../domain/types";
import CategoryFilter from "./CategoryFilter";

type RouteCategoryFiltersProps = {

  /** Configured categories */
  categories: PlaceCategory[];

  /** Is category active/shown in the list? */
  filterList: boolean[];

  /** Show/hide category. */
  onToggle: (index: number) => void;
};

/**
 * List of category filters for route results.
 */
export default function RouteCategoryFilters(
  { categories, filterList, onToggle }: RouteCategoryFiltersProps): JSX.Element {

  return (
    <Stack
      direction={"row"}
      flexWrap={"wrap"}
      justifyContent={"center"}
      spacing={2}
    >
      {categories.map((c, i) => {
        return (
          <CategoryFilter
            key={i}
            active={filterList[i]}
            index={i}
            category={c}
            found={true}
            onToggle={() => { onToggle(i); }}
          />
        );
      })}
    </Stack>
  );
}
