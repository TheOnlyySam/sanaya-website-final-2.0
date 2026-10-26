import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isSupabaseAuthenticated } from "../lib/supabaseFiles";

const PortalOnlyRoute = ({ children }) => {
  const location = useLocation();
  if (!isSupabaseAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return children;
};

export default PortalOnlyRoute;
