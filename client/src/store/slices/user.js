import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../api/auth/authApi";

const initialState = {
  currentUser: null,
  isInitialized: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser(state) {
      state.currentUser = null;
      state.isInitialized = true;
    },
    setUser(state, action) {
      state.currentUser = action.payload;
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.loginUser.matchFulfilled, (state, action) => {
        state.currentUser = action.payload?.user ?? null;
        state.isInitialized = true;
      })
      .addMatcher(authApi.endpoints.getCurrentUser.matchFulfilled, (state, action) => {
        state.currentUser = action.payload?.user ?? null;
        state.isInitialized = true;
      })
      .addMatcher(authApi.endpoints.getCurrentUser.matchRejected, (state) => {
        state.currentUser = null;
        state.isInitialized = true;
      })
      .addMatcher(authApi.endpoints.logoutUser.matchFulfilled, (state) => {
        state.currentUser = null;
        state.isInitialized = true;
      });
  },
});

export const { clearUser, setUser } = userSlice.actions;

export const selectCurrentUser = (state) => state.user.currentUser;
export const selectIsAuthInitialized = (state) => state.user.isInitialized;

export default userSlice.reducer;
