import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const volunteerApi = createApi({
  reducerPath: "volunteerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "",
    credentials: "include",
  }),
  tagTypes: ["VolunteerDashboard", "VolunteerEvents", "VolunteerTasks", "VolunteerParticipants"],
  endpoints: (builder) => ({
    getVolunteerDashboard: builder.query({
      query: () => ({
        url: "/volunteer/dashboard",
        method: "GET",
      }),
      providesTags: ["VolunteerDashboard", "VolunteerTasks"],
    }),
    getVolunteerEvents: builder.query({
      query: () => ({
        url: "/volunteer/events",
        method: "GET",
      }),
      providesTags: ["VolunteerEvents"],
    }),
    getVolunteerTasks: builder.query({
      query: () => ({
        url: "/volunteer/tasks",
        method: "GET",
      }),
      providesTags: ["VolunteerTasks"],
    }),
    updateVolunteerTaskStatus: builder.mutation({
      query: ({ taskId, status }) => ({
        url: `/volunteer/tasks/${taskId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["VolunteerTasks", "VolunteerDashboard"],
    }),
    getEventParticipants: builder.query({
      query: (eventId) => ({
        url: `/volunteer/events/${eventId}/participants`,
        method: "GET",
      }),
      providesTags: (_result, _error, eventId) => [{ type: "VolunteerParticipants", id: eventId }],
    }),
    markAttendance: builder.mutation({
      query: ({ registrationId, attended }) => ({
        url: `/volunteer/registrations/${registrationId}/attendance`,
        method: "PATCH",
        body: { attended },
      }),
      invalidatesTags: (_result, _error, { eventId }) => [
        { type: "VolunteerParticipants", id: eventId },
        "VolunteerEvents",
      ],
    }),
  }),
});

export const {
  useGetVolunteerDashboardQuery,
  useGetVolunteerEventsQuery,
  useGetVolunteerTasksQuery,
  useUpdateVolunteerTaskStatusMutation,
  useGetEventParticipantsQuery,
  useMarkAttendanceMutation,
} = volunteerApi;
