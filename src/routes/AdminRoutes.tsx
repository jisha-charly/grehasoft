import { Routes, Route } from "react-router-dom";

import AdminDashboard from "../pages/admin/AdminDashboard";
import Roles from "../pages/admin/Roles";
import Departments from "../pages/admin/Departments";
import Users from "../pages/admin/Users";
import TaskTypes from "../pages/admin/TaskTypes";
import Clients from "../pages/admin/Clients";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />}>
        <Route path="dashboard" element={<h2>Dashboard Overview</h2>} />
        <Route path="roles" element={<Roles />} />
        <Route path="departments" element={<Departments />} />
        <Route path="users" element={<Users />} />
        <Route path="task-types" element={<TaskTypes />} />
        <Route path="clients" element={<Clients />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
