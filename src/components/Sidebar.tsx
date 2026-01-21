import { NavLink } from "react-router-dom";
import "../css/sidebar.css";
import type { SidebarItem } from "../types";

import {
  MdDashboard,
  MdPeople,
  MdWork,
  MdTask,
  MdGroups,
  MdCall,
  MdBusiness,
  MdAssessment,
  MdSettings,
} from "react-icons/md";

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <MdDashboard /> },
  { label: "Roles", path: "/admin/roles", icon: <MdPeople /> },
  { label: "Users", path: "/admin/users", icon: <MdPeople /> },
  { label: "Projects", path: "/admin/projects", icon: <MdWork /> },
  { label: "Tasks", path: "/admin/tasks", icon: <MdTask /> },
  { label: "Teams", path: "/admin/teams", icon: <MdGroups /> },
  { label: "Leads", path: "/admin/leads", icon: <MdCall /> },
  { label: "Clients", path: "/admin/clients", icon: <MdBusiness /> },
  { label: "Reports", path: "/admin/reports", icon: <MdAssessment /> },
  { label: "Settings", path: "/admin/settings", icon: <MdSettings /> },
];

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Grehasoft</h2>
      <p className="sidebar-subtitle">Admin Panel</p>

      <nav className="sidebar-menu">
        {sidebarItems.map((item) => (
          <NavLink key={item.path} to={item.path} className="sidebar-link">
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
