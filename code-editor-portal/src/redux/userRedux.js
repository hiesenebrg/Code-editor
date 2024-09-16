import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
      state.error = false;
      // state.currentUser = action.payload.data.user;
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    update: (state, action) => {
      console.log(action.payload);
      state.currentUser.data.user.email = action.payload.email;
      state.currentUser.data.user.username = action.payload.name;
      state.currentUser.data.user.password = action.payload.password;
      if (action.payload.avatar) {
        state.currentUser.data.user.avatar = action.payload.avatar;
      }
    },
    logoutAction: (state) => {
      state.currentUser = null;
      // state.info = null;
      state.isFetching = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logoutAction, update } =
  userSlice.actions;
export default userSlice.reducer;
