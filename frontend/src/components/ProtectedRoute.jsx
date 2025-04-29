import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" />; // Redirect to login if no user found
  }

  return children; // Render children (i.e., Dashboard) if user exists
};

export default ProtectedRoute;
