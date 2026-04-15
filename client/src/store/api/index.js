import { authApi } from "./auth/authApi";
import { organizationApi } from "./organization/organizationApi";
import { studentApi } from "./student/studentApi";
import { publicApi } from "./public/publicApi";
import { volunteerApi } from "./volunteer/volunteerApi";

export { authApi, organizationApi, studentApi, publicApi, volunteerApi };
export const {
  useChangePasswordMutation,
  useGetCurrentUserQuery,
  useLoginUserMutation,
  useLogoutUserMutation,
  useUpdateCurrentUserMutation,
} = authApi;
export const {
  useCreateDepartmentMutation,
  useCreateEventMutation,
  useApproveStudentMutation,
  useDeleteCoordinatorMutation,
  useDeleteDepartmentMutation,
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
export const {
  useGetStudentEventByIdQuery,
  useGetStudentEventsQuery,
  useGetStudentOverviewQuery,
  useGetStudentPlanQuery,
  useUpdateStudentPlanMutation,
  useRegisterForEventMutation,
} = studentApi;
export const { useGetEventByFormLinkQuery } = publicApi;

export const {
  useGetVolunteerDashboardQuery,
  useGetVolunteerEventsQuery,
  useGetVolunteerTasksQuery,
  useUpdateVolunteerTaskStatusMutation,
  useGetEventParticipantsQuery,
  useMarkAttendanceMutation,
} = volunteerApi;
