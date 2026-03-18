import React from "react";
import UserLogin from "../components/UserLogin";
import { useSearchParams } from "react-router-dom";
import CollegeLogin from "../components/CollegeLogin";
function Login() {
  const [searchParams] = useSearchParams();
  const college = searchParams.get("college");
  console.log("College param:", college);
  return college  ? <CollegeLogin /> : <UserLogin />;
}

export default Login;
