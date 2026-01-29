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

const menuItems = [
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
      {/* LOGO / TITLE */}
      <div className="p-3 border-bottom border-secondary">
        <h5 className="mb-0 fw-bold">Grehasoft</h5>
        <small className="text-secondary">Admin Panel</small>
      </div>

      {/* MENU */}
      <div className="flex-grow-1 p-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `d-flex align-items-center gap-2 px-3 py-2 rounded mb-1 text-decoration-none ${
                isActive
                  ? "bg-primary text-white"
                  : "text-light sidebar-link"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* LOGOUT (BOTTOM, SAME STYLE) */}
      <div className="p-3 border-top border-secondary">
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 d-flex align-items-center gap-2 justify-content-center"
        >
          <MdLogout />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
