import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const publicApi = createApi({
  reducerPath: "publicApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "",
  }),
  endpoints: (builder) => ({
    getEventByFormLink: builder.query({
      query: (formLink) => ({
        url: `/events/form/${formLink}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetEventByFormLinkQuery } = publicApi;
