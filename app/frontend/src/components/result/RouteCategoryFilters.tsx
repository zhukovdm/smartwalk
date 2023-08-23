import { Stack } from "@mui/material";
import { PlaceCategory } from "../../domain/types";
import CategoryFilter from "./CategoryFilter";

type RouteCategoryFiltersProps = {
  categories: PlaceCategory[];
  filterList: boolean[];
  onToggle: (index: number) => void;
};

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
