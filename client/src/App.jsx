import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OrgRegistration from "./pages/orgregistration";

// Dashboard Refactored
import { DashboardLayout } from "./components/ui/org_admin_compo/DashboardLayout";
import DashboardOverview from "./pages/org_admin_pages/DashboardOverview";
import DepartmentsPage from "./pages/org_admin_pages/DepartmentsPage";

import EventsPage from "./pages/org_admin_pages/EventsPage";
import CoordinatorsPage from "./pages/org_admin_pages/CoordinatorsPage";
import ProfilePage from "./pages/org_admin_pages/ProfilePage";

// Coordinator Dashboard
import { CoordLayout } from "./components/ui/org_admin_compo/CoordLayout";
import CoordOverview from "./pages/coord_pages/CoordOverview";
import MyEventsPage from "./pages/coord_pages/MyEventsPage";
import CreateEventPage from "./pages/coord_pages/CreateEventPage";
import ParticipantsPage from "./pages/coord_pages/ParticipantsPage";
import Register from "./pages/Register";


export default function App() {
  const theme = useSelector((state) => state.theme.value);

  // checking the theme and applying it to the root element
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

        {/* Nested Routing for Org Admin Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="coordinators" element={<CoordinatorsPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Nested Routing for Dept Coordinator Dashboard */}
        <Route path="/coordinator" element={<CoordLayout />}>
          <Route index element={<CoordOverview />} />
          <Route path="events" element={<MyEventsPage />} />
          <Route path="events/create" element={<CreateEventPage />} />
          <Route path="participants" element={<ParticipantsPage />} />
        </Route>

        <Route
          path="*"
          element={
            <div className="flex h-screen items-center justify-center text-2xl font-bold">
              404 Not Found
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
