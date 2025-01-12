import { createSlice , PayloadAction } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    value: false,
  },
  reducers: {
    changeLoading: (state , action: PayloadAction<boolean>) => {
      state.value = action.payload;
    }
  },
});

export const { changeLoading } = loadingSlice.actions;
export default loadingSlice.reducer;