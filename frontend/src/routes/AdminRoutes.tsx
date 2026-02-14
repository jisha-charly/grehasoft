import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Roles from "../pages/admin/Roles";
import Departments from "../pages/admin/Departments";
import Users from "../pages/admin/Users";
import TaskTypes from "../pages/admin/TaskTypes";
import Clients from "../pages/admin/Clients";
import Projects from "../pages/admin/Projects";
import ProjectDetails from "../pages/admin/ProjectDetails";
import Settings from "../pages/admin/Settings";
import NotFound from "../pages/NotFound";
import ErrorBoundary from "../pages/ErrorBoundary";
import UnderDevelopment from "../pages/UnderDevelopment";
import AllTaskBoard from "../pages/admin/AllTaskBoard";
const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>

        {/* /admin */}
        <Route index element={<Dashboard />} />

        {/* /admin/dashboard  ✅ FIX */}
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="roles" element={<Roles />} />
        <Route path="departments" element={<Departments />} />
        <Route path="users" element={<Users />} />
        <Route path="task-types" element={<TaskTypes />} />
        <Route path="clients" element={<Clients />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="settings" element={<Settings />} />
       
       <Route path="all-task-board" element={<AllTaskBoard />} />

        <Route
  path="*"
  element={
    <ErrorBoundary>
      <UnderDevelopment />
    </ErrorBoundary>
  }
/>
      </Route>
    </Routes>
  );
};


export default AdminRoutes;
