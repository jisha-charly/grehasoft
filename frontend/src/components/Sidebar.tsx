import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdApartment,
  MdPeople,
  MdTask,
  MdBusiness,
  MdWork,
  MdGroups,
  MdCall,
  MdAssessment,
  MdSettings,
  MdLogout,
} from "react-icons/md";
import "../css/sidebar.css";
const sidebarItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <MdDashboard /> },
  { label: "Roles", path: "/admin/roles", icon: <MdPeople /> },
  { label: "Departments", path: "/admin/departments", icon: <MdApartment /> },
  { label: "Users", path: "/admin/users", icon: <MdPeople /> },
  { label: "Task Types", path: "/admin/task-types", icon: <MdTask /> },
  { label: "Clients", path: "/admin/clients", icon: <MdBusiness /> },
  { label: "Projects", path: "/admin/projects", icon: <MdWork /> },
  { label: "Teams", path: "/admin/teams", icon: <MdGroups /> },
  { label: "Leads", path: "/admin/leads", icon: <MdCall /> },
  { label: "Reports", path: "/admin/reports", icon: <MdAssessment /> },
  { label: "Settings", path: "/admin/settings", icon: <MdSettings /> },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside
      className="d-flex flex-column bg-dark text-white"
      style={{ width: 260, minHeight: "100vh" }}
    >
      {/* BRAND */}
      <div className="px-3 py-3 border-bottom border-secondary">
        <h5 className="mb-0 fw-bold">Grehasoft</h5>
        <small className="text-secondary">Admin Panel</small>
      </div>

      {/* MENU */}
      <div className="flex-grow-1 px-2 py-3">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none mb-1 ${
                isActive
                  ? "bg-primary text-white"
                  : "text-light sidebar-link"
              }`
            }
          >
            <span className="fs-5">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* LOGOUT */}
      <div className="px-3 py-3 border-top border-secondary">
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <MdLogout />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
