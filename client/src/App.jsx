import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import AuthBootstrap from "@/components/auth/AuthBootstrap";
import {
  DashboardIndexRedirect,
  ProtectedDashboard,
  RoleGate,
} from "@/components/auth/RoleBasedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import NotFound from "@/components/common/NotFound";
import PublicRegistrationPage from "@/pages/PublicRegistrationPage";
import RegistrationSuccessPage from "@/pages/RegistrationSuccessPage";
import {
  Home,
  Login,
  OrgRegistration,
  Register,
  OrgAdminOverview,
  DepartmentsPage,
  EventsPage,
  CoordinatorsPage,
  CollegeDetailsPage,
  ProfilePage,
  CoordOverview,
  MyEventsPage,
  CreateEventPage,
  CoordinatorProfilePage,
  ParticipantsPage,
  EventDetailPage,
  StudentOverview,
  StudentEventsPage,
  StudentEventDetailPage,
  StudentProfilePage,
  VolunteerOverview,
  VolunteerEventsPage,
  VolunteerTasksPage,
  VolunteerAttendancePage,
} from "./pages";

export default function App() {
  const theme = useSelector((state) => state.theme.value);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      // window matchMeadi is used to check the system theme
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <AuthBootstrap />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orgregistration" element={<OrgRegistration />} />
        <Route path="/register/:formLink" element={<PublicRegistrationPage />} />
        <Route path="/registration-success" element={<RegistrationSuccessPage />} />

        <Route path="/dashboard" element={<ProtectedDashboard />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardIndexRedirect />} />

            <Route element={<RoleGate allowedRoles={["collegeadmin"]} />}>
              <Route path="collegeadmin">
                <Route index element={<OrgAdminOverview />} />
                <Route path="departments" element={<DepartmentsPage />} />
                <Route path="coordinators" element={<CoordinatorsPage />} />
                <Route path="events" element={<EventsPage />} />
                <Route path="events/create" element={<CreateEventPage />} />
                <Route path="events/:eventId" element={<EventDetailPage />} />
                <Route path="college" element={<CollegeDetailsPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Route>

            <Route element={<RoleGate allowedRoles={["coordinator"]} />}>
              <Route path="coordinator">
                <Route index element={<CoordOverview />} />
                <Route path="events">
                  <Route index element={<MyEventsPage />} />
                  <Route path="create" element={<CreateEventPage />} />
                  <Route path=":eventId" element={<EventDetailPage />} />
                </Route>
                <Route path="students" element={<ParticipantsPage />} />
                <Route path="participants" element={<ParticipantsPage />} />
                <Route path="profile" element={<CoordinatorProfilePage />} />
              </Route>
            </Route>

            <Route element={<RoleGate allowedRoles={["student"]} />}>
              <Route path="student">
                <Route index element={<StudentOverview />} />
                <Route path="events" element={<StudentEventsPage />} />
                <Route path="events/:eventId" element={<StudentEventDetailPage />} />
                <Route path="profile" element={<StudentProfilePage />} />
              </Route>
            </Route>

            <Route element={<RoleGate allowedRoles={["student", "volunteer"]} />}>
              <Route path="volunteer">
                <Route index element={<VolunteerOverview />} />
                <Route path="events" element={<VolunteerEventsPage />} />
                <Route path="events/:eventId" element={<VolunteerAttendancePage />} />
                <Route path="tasks" element={<VolunteerTasksPage />} />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
