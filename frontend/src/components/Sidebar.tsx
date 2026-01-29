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
      className="d-flex flex-column bg-light border-end p-3"
      style={{ width: 260, minHeight: "100vh" }}
    >
      <div className="flex-grow-1">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `d-flex align-items-center gap-2 p-2 rounded text-decoration-none mb-1 ${
                isActive ? "bg-primary text-white" : "text-dark"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* LOGOUT */}
      <button
        className="btn btn-outline-danger d-flex align-items-center gap-2 mt-3"
        onClick={handleLogout}
      >
        <MdLogout />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
