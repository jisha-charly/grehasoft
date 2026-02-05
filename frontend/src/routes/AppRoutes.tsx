import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import AdminRoutes from "./AdminRoutes";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/NotFound";
const AppRoutes = () => {
  return (
    <Routes>
     <Route path="*" element={<NotFound />} />
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />

      {/* PROTECTED */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />
     
    </Routes>
  );
};

export default AppRoutes;
