import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "",
    credentials: "include",
  }),
  tagTypes: ["StudentOverview", "StudentEvent", "StudentPlan"],
  endpoints: (builder) => ({
    getStudentOverview: builder.query({
      query: () => ({
        url: "/students/overview",
        method: "GET",
      }),
      providesTags: ["StudentOverview"],
    }),
    getStudentEvents: builder.query({
      query: () => ({
        url: "/students/events",
        method: "GET",
      }),
      providesTags: ["StudentEvent"],
    }),
    getStudentEventById: builder.query({
      query: (eventId) => ({
        url: `/students/events/${eventId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, eventId) => [
        { type: "StudentEvent", id: eventId },
      ],
    }),
    getStudentPlan: builder.query({
      query: () => ({
        url: "/students/plan",
        method: "GET",
      }),
      providesTags: ["StudentPlan"],
    }),
    updateStudentPlan: builder.mutation({
      query: (payload) => ({
        url: "/students/plan",
        method: "PATCH",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["StudentPlan", "StudentOverview"],
    }),
    registerForEvent: builder.mutation({
      query: ({ eventId, formResponse }) => ({
        url: `/events/${eventId}/register`,
        method: "POST",
        body: { formResponse },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["StudentEvent", "StudentOverview"],
    }),
  }),
});

export const {
  useGetStudentEventByIdQuery,
  useGetStudentEventsQuery,
  useGetStudentOverviewQuery,
  useGetStudentPlanQuery,
  useUpdateStudentPlanMutation,
  useRegisterForEventMutation,
} = studentApi;
