import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import AdminRoutes from "./AdminRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
