import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";

const PrivateRoute = ({ allowedRoles }) => {
  const { profile } = useContext(AuthContext);

  if (profile) {
    if (allowedRoles && !allowedRoles.includes(profile.role.name)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  return <Outlet />;
};

export default PrivateRoute;
