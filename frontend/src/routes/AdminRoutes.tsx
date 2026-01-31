import { Routes, Route } from "react-router-dom";

import AdminDashboard from "../pages/admin/AdminDashboard";
import Roles from "../pages/admin/Roles";
import Departments from "../pages/admin/Departments";
import Users from "../pages/admin/Users";
import TaskTypes from "../pages/admin/TaskTypes";
import Clients from "../pages/admin/Clients";
import Projects from "../pages/admin/Projects";
import ProjectDetails from "../pages/admin/ProjectDetails";
import Settings from "../pages/admin/Settings";
import NotFound from "../pages/NotFound";
import TasksPage from "../pages/tasks/TasksPage";
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
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="/admin/tasks" element={<TasksPage />} />
        <Route path="settings" element={<Settings />} />

        {/* 🔴 ADMIN 404 */}
        <Route path="*" element={<NotFound />} />
      

      {/* 🔴 GLOBAL 404 */}
      <Route path="*" element={<NotFound />} />
    
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
