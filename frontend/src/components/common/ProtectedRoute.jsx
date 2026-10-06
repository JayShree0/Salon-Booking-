import React from "react";
import { Navigate } from "react-router-dom";
import authApi from "../../api/authApi";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuth = authApi.isAuthenticated();
  const currentRole = authApi.getRole();

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

