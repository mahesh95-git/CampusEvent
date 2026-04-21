import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const judgeApi = createApi({
  reducerPath: "judgeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "",
    credentials: "include",
  }),
  tagTypes: ["JudgeDashboard", "JudgeEvent"],
  endpoints: (builder) => ({
    getJudgeDashboard: builder.query({
      query: () => ({
        url: "/judge/dashboard",
        method: "GET",
      }),
      providesTags: ["JudgeDashboard"],
    }),
    getJudgeEvents: builder.query({
      query: () => ({
        url: "/judge/events",
        method: "GET",
      }),
      providesTags: ["JudgeEvent"],
    }),
    getJudgeEventById: builder.query({
      query: (eventId) => ({
        url: `/judge/events/${eventId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, eventId) => [{ type: "JudgeEvent", id: eventId }],
    }),
    saveJudgeScore: builder.mutation({
      query: ({ eventId, ...payload }) => ({
        url: `/judge/events/${eventId}/scores`,
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["JudgeDashboard", "JudgeEvent"],
    }),
    saveJudgeResult: builder.mutation({
      query: ({ eventId, ...payload }) => ({
        url: `/judge/events/${eventId}/results`,
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["JudgeDashboard", "JudgeEvent"],
    }),
  }),
});

export const {
  useGetJudgeDashboardQuery,
  useGetJudgeEventsQuery,
  useGetJudgeEventByIdQuery,
  useSaveJudgeResultMutation,
  useSaveJudgeScoreMutation,
} = judgeApi;
