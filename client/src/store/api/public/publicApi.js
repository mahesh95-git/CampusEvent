import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const publicApi = createApi({
  reducerPath: "publicApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "",
  }),
  endpoints: (builder) => ({
    getPublicOrganizationStats: builder.query({
      query: () => ({
        url: "/organizations/public/stats",
        method: "GET",
      }),
    }),
    submitInquiry: builder.mutation({
      query: (inquiry) => ({
        url: "/inquiries",
        method: "POST",
        body: inquiry,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getEventByFormLink: builder.query({
      query: (formLink) => ({
        url: `/events/form/${formLink}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetEventByFormLinkQuery,
  useGetPublicOrganizationStatsQuery,
  useSubmitInquiryMutation,
} = publicApi;
