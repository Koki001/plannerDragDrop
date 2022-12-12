import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  username: "",
  email: "",
  active: false,
};
export const userSlice = createSlice({
  name: "user",
  initialState: {
    id: "",
    username: "",
    email: "",
    active: false,
  },
  reducers: {
    USER_ID: (state, action) => {
      state.id = action.payload;
    },
    USER_NAME: (state, action) => {
      state.username = action.payload;
    },
    USER_EMAIL: (state, action) => {
      state.email = action.payload;
    },
    USER_LOGGED_IN: (state, action) => {
      state.active = action.payload;
    },
    USER_SIGN_OUT: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const {
  USER_ID,
  USER_LOGGED_IN,
  USER_NAME,
  USER_EMAIL,
  USER_SIGN_OUT,
} = userSlice.actions;

export default userSlice.reducer;
