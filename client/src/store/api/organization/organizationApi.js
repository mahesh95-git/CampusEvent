import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const organizationApi = createApi({
  reducerPath: "organizationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "",
    credentials: "include",
  }),
  tagTypes: ["Department", "Event", "Coordinator", "Organization", "Overview", "Participant", "CoordinatorOverview"],
  endpoints: (builder) => ({
    getOrganizationBySlug: builder.query({
      query: (slug) => ({
        url: `/organizations/${slug}`,
        method: "GET",
      }),
    }),
    registerStudentForCollege: builder.mutation({
      query: ({ collegeSlug, ...payload }) => ({
        url: `/organizations/${collegeSlug}/students`,
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getMyOrganization: builder.query({
      query: () => ({
        url: "/organizations/me",
        method: "GET",
      }),
      providesTags: ["Organization"],
    }),
    updateMyOrganization: builder.mutation({
      query: (organizationData) => ({
        url: "/organizations/me",
        method: "PATCH",
        body: organizationData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Organization", "Overview"],
    }),
    getOrganizationOverview: builder.query({
      query: () => ({
        url: "/organizations/me/overview",
        method: "GET",
      }),
      providesTags: ["Overview"],
    }),
    getDepartments: builder.query({
      query: () => ({
        url: "/departments",
        method: "GET",
      }),
      providesTags: ["Department"],
    }),
    getCoordinators: builder.query({
      query: () => ({
        url: "/departments/coordinators",
        method: "GET",
      }),
      providesTags: ["Coordinator"],
    }),
    createDepartment: builder.mutation({
      query: (departmentData) => ({
        url: "/departments",
        method: "POST",
        body: departmentData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Department", "Coordinator", "Overview"],
    }),
    getEvents: builder.query({
      query: () => ({
        url: "/events",
        method: "GET",
      }),
      providesTags: ["Event"],
    }),
    getEventById: builder.query({
      query: (eventId) => ({
        url: `/events/${eventId}`,
        method: "GET",
      }),
      providesTags: ["Event"],
    }),
    getCoordinatorOverview: builder.query({
      query: () => ({
        url: "/events/coordinator/overview",
        method: "GET",
      }),
      providesTags: ["CoordinatorOverview"],
    }),
    getParticipants: builder.query({
      query: () => ({
        url: "/events/participants",
        method: "GET",
      }),
      providesTags: ["Participant"],
    }),
    getStudents: builder.query({
      query: () => ({
        url: "/departments/students",
        method: "GET",
      }),
      providesTags: ["Participant"],
    }),
    createEvent: builder.mutation({
      query: (eventData) => ({
        url: "/events",
        method: "POST",
        body: eventData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Event", "Overview", "CoordinatorOverview"],
    }),
    updateEventStatus: builder.mutation({
      query: ({ eventId, status }) => ({
        url: `/events/${eventId}/status`,
        method: "PATCH",
        body: { status },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Event", "Overview", "CoordinatorOverview"],
    }),
    assignVolunteer: builder.mutation({
      query: ({ email, eventId, title, description, priority }) => ({
        url: "/volunteer/assign",
        method: "POST",
        body: { email, eventId, title, description, priority },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Event"],
    }),
    getEventVolunteers: builder.query({
      query: (eventId) => ({
        url: `/volunteer/events/${eventId}/volunteers`,
        method: "GET",
      }),
      providesTags: (_result, _error, eventId) => [{ type: "Event", id: eventId }],
    }),
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

export const {
  useCreateDepartmentMutation,
  useCreateEventMutation,
  useGetCoordinatorOverviewQuery,
  useGetCoordinatorsQuery,
  useGetDepartmentsQuery,
  useGetEventByIdQuery,
  useGetEventsQuery,
  useGetMyOrganizationQuery,
  useGetOrganizationBySlugQuery,
  useGetOrganizationOverviewQuery,
  useGetParticipantsQuery,
  useGetStudentsQuery,
  useRegisterStudentForCollegeMutation,
  useRegisterOrganizationMutation,
  useUpdateEventStatusMutation,
  useUpdateMyOrganizationMutation,
  useAssignVolunteerMutation,
  useGetEventVolunteersQuery,
} = organizationApi;
