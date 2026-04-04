import { authApi } from "./auth/authApi";
import { organizationApi } from "./organization/organizationApi";
import { studentApi } from "./student/studentApi";
import { publicApi } from "./public/publicApi";

export { authApi, organizationApi, studentApi, publicApi };
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
