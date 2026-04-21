import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/theme";
import userReducer from "./slices/user";
import { authApi, judgeApi, organizationApi, studentApi, publicApi, volunteerApi } from "./api";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [judgeApi.reducerPath]: judgeApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    [studentApi.reducerPath]: studentApi.reducer,
    [publicApi.reducerPath]: publicApi.reducer,
    [volunteerApi.reducerPath]: volunteerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      judgeApi.middleware,
      organizationApi.middleware,
      studentApi.middleware,
      publicApi.middleware,
      volunteerApi.middleware,
    ),
});

export default store;
