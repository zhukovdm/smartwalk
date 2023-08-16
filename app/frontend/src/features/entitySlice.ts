import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ExtendedPlace } from "../domain/types";

type EntityState = {
  place?: ExtendedPlace;
};

const initialState = (): EntityState => ({});

export const entitySlice = createSlice({
  name: "entity",
  initialState: initialState(),
  reducers: {
    setEntityPlace: (state, action: PayloadAction<ExtendedPlace>) => {
      state.place = action.payload;
    },
  }
});

export const {
  setEntityPlace
} = entitySlice.actions;

export default entitySlice.reducer;
