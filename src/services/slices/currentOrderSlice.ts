import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

interface CurrentOrderState {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CurrentOrderState = {
  order: null,
  isLoading: false,
  error: null
};

export const getOrderByNumber = createAsyncThunk(
  'currentOrder/getByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

const currentOrderSlice = createSlice({
  name: 'currentOrder',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.order = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch order';
      });
  }
});

export const { clearCurrentOrder } = currentOrderSlice.actions;
export const currentOrderReducer = currentOrderSlice.reducer;
