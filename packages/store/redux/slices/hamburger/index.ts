import { createSlice } from "@reduxjs/toolkit";

export const hamburgerSlice = createSlice({
  name: "hamburger",
  initialState: {
    value: false,
  },
  reducers: {
    click: (state) => {
      state.value = !state.value;
    }
  },
});

export const { click } = hamburgerSlice.actions;
export default hamburgerSlice.reducer;