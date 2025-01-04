import { createSlice , PayloadAction } from "@reduxjs/toolkit";

export const errorSlice = createSlice({
  name: "error",
  initialState: {
    value: {
      msg : "",
      isOpen : false,
      severity:"" as "error" | "warning" | "info" | "success",
    },
  },
  reducers: {
    errorTrue: (state) => {
      state.value.isOpen = true;
    },
    errorFalse: (state) => {
      state.value.isOpen = false;
    },
    setMessage: (state, action: PayloadAction<string>)=> {
      state.value.msg = action.payload;
    },
    setSeverity: (state, action: PayloadAction<"error" | "warning" | "info" | "success">)=> {
      state.value.severity = action.payload;
    }
  },
});

export const { errorTrue , errorFalse , setMessage , setSeverity } = errorSlice.actions;
export default errorSlice.reducer;