import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    value: false,
  },
  reducers: {
    changeLoading: (state) => {
      state.value = !state.value;
    }
  },
});

export const { changeLoading } = loadingSlice.actions;
export default loadingSlice.reducer;