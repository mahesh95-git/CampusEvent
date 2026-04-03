import { authApi } from "./auth/authApi";
import { organizationApi } from "./organization/organizationApi";

export { authApi, organizationApi };
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
