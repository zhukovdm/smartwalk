import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import type { KeywordCategory } from "../../domain/types";
import CategoryButton from "./CategoryButton";
import CategoryChip from "./CategoryChip";

export type CategoryBoxProps = {

  /** List of already added categories */
  categories: KeywordCategory[];

  /** Action appending new category to the list */
  onAppend: (category: KeywordCategory) => void;

  /** Action deleting a category at position `i` in the list */
  onDelete: (i: number) => void;

  /** Action updating a category at position `i` */
  onUpdate: (category: KeywordCategory, i: number) => void;
};

/**
 * Component rendering box with removable categories.
 */
export default function CategoryBox(
  { categories, onAppend, onDelete, onUpdate }: CategoryBoxProps): JSX.Element {

  return (
    <Box>
      <Paper
        role={"none"}
        variant={"outlined"}
      >
        <Stack
          aria-label={"Categories"}
          role={"list"}
          direction={"row"}
          flexWrap={"wrap"}
        >
          {categories.map((category, i) => (
            <CategoryChip
              key={i}
              category={category}
              index={i}
              onDelete={() => { onDelete(i); }}
              onUpdate={(category) => { onUpdate(category, i); }}
            />
          ))}
        </Stack>
        <CategoryButton onAppend={onAppend} />
      </Paper>
    </Box>
  );
}
