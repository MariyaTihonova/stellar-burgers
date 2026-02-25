import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface CurrentIngredientState {
  ingredient: TIngredient | null;
}

const initialState: CurrentIngredientState = {
  ingredient: null
};

const currentIngredientSlice = createSlice({
  name: 'currentIngredient',
  initialState,
  reducers: {
    setCurrentIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingredient = action.payload;
    },
    clearCurrentIngredient: (state) => {
      state.ingredient = null;
    }
  }
});

export const { setCurrentIngredient, clearCurrentIngredient } =
  currentIngredientSlice.actions;
export const currentIngredientReducer = currentIngredientSlice.reducer;
