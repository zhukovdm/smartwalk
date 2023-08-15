import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ExtendedPlace } from "../domain/types";

type EntityState = {
  back?: string;
  entity?: ExtendedPlace;
};

const initialState = (): EntityState => {
  return {};
}

export const entitySlice = createSlice({
  name: "entity",
  initialState: initialState(),
  reducers: {
    setEntity: (state, action: PayloadAction<ExtendedPlace>) => { state.entity = action.payload; },
    setEntityBack: (state, action: PayloadAction<string>) => { state.back = action.payload }
  }
});

export const {
  setEntity,
  setEntityBack
} = entitySlice.actions;

export default entitySlice.reducer;
