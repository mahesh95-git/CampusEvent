import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./components/NotFound";
import {
  Home,
  Login,
  OrgRegistration,
  Register,
  OrgAdminOverview,
  DepartmentsPage,
  EventsPage,
  CoordinatorsPage,
  ProfilePage,
  CoordOverview,
  MyEventsPage,
  CreateEventPage,
  ParticipantsPage,
  StudentOverview,
  StudentEventsPage,
  StudentEventDetailPage,
  StudentProfilePage,
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orgregistration" element={<OrgRegistration />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Org Admin Routes */}
          <Route path="orgadmin">
            <Route index element={<OrgAdminOverview />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="coordinators" element={<CoordinatorsPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Coordinator Routes */}
          <Route path="coordinator">
            <Route index element={<CoordOverview />} />
            <Route path="events">
              <Route index element={<MyEventsPage />} />
              <Route path="create" element={<CreateEventPage />} />
            </Route>
            <Route path="participants" element={<ParticipantsPage />} />
          </Route>

          {/* Student Routes */}
          <Route path="student">
            <Route index element={<StudentOverview />} />
            <Route path="events" element={<StudentEventsPage />} />
            <Route path="events/:eventId" element={<StudentEventDetailPage />} />
            <Route path="profile" element={<StudentProfilePage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
