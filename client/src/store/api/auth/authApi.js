import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),
  tagTypes: ["AuthUser"],
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getCurrentUser: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["AuthUser"],
    }),
    updateCurrentUser: builder.mutation({
      query: (payload) => ({
        url: "/auth/me",
        method: "PATCH",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["AuthUser"],
    }),
    changePassword: builder.mutation({
      query: (payload) => ({
        url: "/auth/me/password",
        method: "PATCH",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["AuthUser"],
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useChangePasswordMutation,
  useGetCurrentUserQuery,
  useLoginUserMutation,
  useLogoutUserMutation,
  useUpdateCurrentUserMutation,
} = authApi;
