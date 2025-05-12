import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";

const RequireAuth = () => {
  const token = localStorage.getItem("accessToken");
  const { profile } = useContext(AuthContext);

  if (!token || !profile) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
