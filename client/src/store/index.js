import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/theme";
import userReducer from "./slices/user";
import { authApi, organizationApi, studentApi, publicApi } from "./api";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    [studentApi.reducerPath]: studentApi.reducer,
    [publicApi.reducerPath]: publicApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      organizationApi.middleware,
      studentApi.middleware,
      publicApi.middleware,
    ),
});

export default store;
