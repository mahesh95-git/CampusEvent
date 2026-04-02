import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/theme";
import { organizationApi } from "./api";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(organizationApi.middleware),
});

export default store;