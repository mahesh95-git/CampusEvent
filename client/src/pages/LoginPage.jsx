import React from "react";
import { useSearchParams } from "react-router-dom";
import CollegeLogin from "../components/CollegeLogin";
import NotFound from "../components/NotFound";
function Login() {
  const [searchParams] = useSearchParams();
  const college = searchParams.get("college");

  return college? (
    <CollegeLogin college={college} />
  ) : <NotFound/>;
}

export default Login;
