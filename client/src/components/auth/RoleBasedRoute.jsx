import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation, useOutletContext } from "react-router-dom";
import {
  selectCurrentUser,
  selectIsAuthInitialized,
} from "@/store/slices/user";

function getDashboardPathForRole(role) {
  switch (role) {
    case "collegeadmin":
      return "/dashboard/collegeadmin";
    case "coordinator":
      return "/dashboard/coordinator";
    case "student":
      return "/dashboard/student";
    case "volunteer":
      return "/dashboard/volunteer";
    case "judge":
      return "/dashboard/judge";
    default:
      return "/login";
  }
}

function FullPageMessage({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070D1A] text-slate-300 text-sm">
      {message}
    </div>
  );
}

export function ProtectedDashboard() {
  const location = useLocation();
  const currentUser = useSelector(selectCurrentUser);
  const isInitialized = useSelector(selectIsAuthInitialized);
  const parentContext = useOutletContext();

  if (!isInitialized) {
    return <FullPageMessage message="Checking your account..." />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet context={parentContext} />;
}

export function DashboardIndexRedirect() {
  const currentUser = useSelector(selectCurrentUser);
  const isInitialized = useSelector(selectIsAuthInitialized);

  if (!isInitialized) {
    return <FullPageMessage message="Loading dashboard..." />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getDashboardPathForRole(currentUser.role)} replace />;
}

export function RoleGate({ allowedRoles }) {
  const currentUser = useSelector(selectCurrentUser);
  const isInitialized = useSelector(selectIsAuthInitialized);
  const parentContext = useOutletContext();

  if (!isInitialized) {
    return <FullPageMessage message="Loading your access..." />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to={getDashboardPathForRole(currentUser.role)} replace />;
  }

  return <Outlet context={parentContext} />;
}
