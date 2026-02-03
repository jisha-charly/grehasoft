import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("access");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
