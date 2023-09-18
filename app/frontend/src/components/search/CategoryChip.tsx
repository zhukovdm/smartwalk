import { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import type { KeywordCategory } from "../../domain/types";
import CategoryDialog from "./CategoryDialog";

export type CategoryChipProps = {

  /** Considered category */
  category: KeywordCategory;

  /** Position in the list */
  index: number;

  /** Callback deleting chip */
  onDelete: () => void;

  /** Callback updating chip on a certain position */
  onUpdate: (category: KeywordCategory) => void;
};

export default function CategoryChip(
  { category, index, onDelete, onUpdate }: CategoryChipProps): JSX.Element {

  const [showDialog, setShowDialog] = useState(false);

  return (
    <Box role={"listitem"}>
      <Chip
        color={"primary"}
        sx={{ m: 0.35, fontWeight: "medium" }}
        variant={"filled"}
        label={`${index + 1}: ${category.keyword}`}
        onClick={() => { setShowDialog(true); }}
        onDelete={onDelete}
      />
      {showDialog /* hard reset */ &&
        <CategoryDialog
          category={category}
          onHide={() => { setShowDialog(false); }}
          onInsert={(category) => { onUpdate(category); }}
        />
      }
    </Box>
  );
}
