import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdApartment,
  MdPeople,
  MdWork,
  MdTask,
  MdGroups,
  MdCall,
  MdBusiness,
  MdAssessment,
  MdSettings,
} from "react-icons/md";

const sidebarItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <MdDashboard /> },
  { label: "Roles", path: "/admin/roles", icon: <MdPeople /> },
  { label: "Departments", path: "/admin/departments", icon: <MdApartment /> },
  { label: "Users", path: "/admin/users", icon: <MdPeople /> },
  { label: "Projects", path: "/admin/projects", icon: <MdWork /> },
  { label: "Tasks", path: "/admin/tasks", icon: <MdTask /> },
  { label: "Teams", path: "/admin/teams", icon: <MdGroups /> },
  { label: "Leads", path: "/admin/leads", icon: <MdCall /> },
  { label: "Clients", path: "/admin/clients", icon: <MdBusiness /> },
  { label: "Reports", path: "/admin/reports", icon: <MdAssessment /> },
  { label: "Settings", path: "/admin/settings", icon: <MdSettings /> },
];

const Sidebar = () => {
  return (
    <aside
      className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark"
      style={{ width: 260, minHeight: "100vh" }}
    >
      <span className="fs-4 fw-bold mb-1">Grehasoft</span>
      <small className="text-secondary mb-3">Admin Panel</small>

      <ul className="nav nav-pills flex-column gap-1">
        {sidebarItems.map((item) => (
          <li key={item.path} className="nav-item">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 ${
                  isActive ? "active" : "text-white"
                }`
              }
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
