import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import type { KeywordCategory } from "../../domain/types";
import CategoryDialog from "./CategoryDialog";

export type CategoryButtonProps = {

  /** Callback appending new category */
  onAppend: (category: KeywordCategory) => void;
};

export default function CategoryButton({ onAppend }: CategoryButtonProps): JSX.Element {

  const [showDialog, setShowDialog] = useState(false);

  return (
    <Box>
      <Button
        sx={{ width: "100%" }}
        size={"large"}
        onClick={() => { setShowDialog(true); }}
      >
        <span>Add category</span>
      </Button>
      {showDialog /* hard reset */ &&
        <CategoryDialog
          onHide={() => { setShowDialog(false); }}
          onInsert={(category) => { onAppend(category); }}
        />
      }
    </Box>
  );
}
