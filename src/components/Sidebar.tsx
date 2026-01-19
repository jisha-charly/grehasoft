import { NavLink } from "react-router-dom";
import "./sidebar.css";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Grehasoft</h2>
      <p className="sidebar-subtitle">Admin Panel</p>

      <nav className="sidebar-menu">
        <NavLink to="/admin/dashboard">📊 Dashboard</NavLink>
        <NavLink to="/admin/users">👥 Users</NavLink>
        <NavLink to="/admin/projects">📁 Projects</NavLink>
        <NavLink to="/admin/tasks">✅ Tasks</NavLink>
        <NavLink to="/admin/teams">🤝 Teams</NavLink>

        <hr />

        <NavLink to="/admin/leads">📞 Leads</NavLink>
        <NavLink to="/admin/clients">🏢 Clients</NavLink>

        <hr />

        <NavLink to="/admin/reports">📈 Reports</NavLink>
        <NavLink to="/admin/settings">⚙️ Settings</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
