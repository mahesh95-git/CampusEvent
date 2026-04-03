import React from "react";
import { useGetCurrentUserQuery } from "@/store/api";

export default function AuthBootstrap() {
  useGetCurrentUserQuery();
  return null;
}
