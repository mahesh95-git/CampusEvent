import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/theme";
import userReducer from "./slices/user";
import { authApi, organizationApi } from "./api";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, organizationApi.middleware),
});

export default store;
