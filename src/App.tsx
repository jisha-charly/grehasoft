import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/admin" element={<AdminDashboard />}>
        <Route path="dashboard" element={<h2>Dashboard Overview</h2>} />
        <Route path="users" element={<Users />} />
        <Route path="projects" element={<h2>Projects</h2>} />
        <Route path="tasks" element={<h2>Tasks</h2>} />
        <Route path="teams" element={<h2>Teams</h2>} />
        <Route path="leads" element={<h2>Leads</h2>} />
        <Route path="clients" element={<h2>Clients</h2>} />
        <Route path="reports" element={<h2>Reports</h2>} />
        <Route path="settings" element={<h2>Settings</h2>} />
      </Route>
    </Routes>
  );
};

export default App;
