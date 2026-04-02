import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const organizationApi = createApi({
  reducerPath: "organizationApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL || "" }),
  endpoints: (builder) => ({
    registerOrganization: builder.mutation({
      query: (organizationData) => ({
        url: "/organizations",
        method: "POST",
        body: organizationData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    
  }),
});

export const { useRegisterOrganizationMutation } = organizationApi;
