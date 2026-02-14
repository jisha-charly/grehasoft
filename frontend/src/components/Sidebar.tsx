import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdWork,
  MdBusiness,
  MdTask,
  MdViewKanban,
  MdPeople,
  MdApartment,
  MdSettings,
  MdAssessment,
  MdGroups,
  MdCall,
  MdLogout,
  MdFolderShared,
} from "react-icons/md";

type Role =
  | "ADMIN"
  | "PROJECT_MANAGER"
  | "EMPLOYEE"
  | "SALES_MANAGER"
  | "SALES_EXECUTIVE"
  | "CLIENT";

/* ================= GET ROLE SAFELY ================= */
const getUserRole = (): Role => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined") return "EMPLOYEE";

    const user = JSON.parse(storedUser);
    return user?.role?.name?.toUpperCase() || "EMPLOYEE";
  } catch {
    return "EMPLOYEE";
  }
};

const Sidebar = () => {
  const navigate = useNavigate();
  const role = getUserRole();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  /* ================= ROLE BASED MENU ================= */
  const menu: Record<Role, any[]> = {
    ADMIN: [
      { label: "Dashboard", path: "/admin/dashboard", icon: <MdDashboard /> },
      { label: "Projects", path: "/admin/projects", icon: <MdWork /> },
      { label: "Clients", path: "/admin/clients", icon: <MdBusiness /> },
      { label: "Task Types", path: "/admin/task-types", icon: <MdTask /> },
      { label: "All Task Board", path: "/admin/all-task-board", icon: <MdViewKanban /> },
      { label: "Reports", path: "/admin/reports", icon: <MdAssessment /> },
      { label: "Users", path: "/admin/users", icon: <MdGroups /> },
      { label: "Roles", path: "/admin/roles", icon: <MdPeople /> },
      { label: "Departments", path: "/admin/departments", icon: <MdApartment /> },
      { label: "Settings", path: "/admin/settings", icon: <MdSettings /> },
      { label: "CRM Leads", path: "/admin/crm/leads", icon: <MdCall /> },
    ],

    PROJECT_MANAGER: [
      { label: "Dashboard", path: "/manager/dashboard", icon: <MdDashboard /> },
      { label: "My Projects", path: "/manager/projects", icon: <MdWork /> },
      { label: "Tasks", path: "/manager/tasks", icon: <MdTask /> },
     
      { label: "Team", path: "/manager/team", icon: <MdGroups /> },
      { label: "Reports", path: "/manager/reports", icon: <MdAssessment /> },
    ],

    EMPLOYEE: [
      { label: "My Tasks", path: "/tasks/my", icon: <MdTask /> },
     
      { label: "My Projects", path: "/projects/my", icon: <MdWork /> },
      { label: "Work Uploads", path: "/uploads", icon: <MdFolderShared /> },
    ],

    SALES_MANAGER: [
      { label: "CRM Dashboard", path: "/crm/dashboard", icon: <MdDashboard /> },
      { label: "Leads", path: "/crm/leads", icon: <MdCall /> },
      { label: "Clients", path: "/crm/clients", icon: <MdBusiness /> },
      { label: "Reports", path: "/crm/reports", icon: <MdAssessment /> },
    ],

    SALES_EXECUTIVE: [
      { label: "My Leads", path: "/crm/leads/my", icon: <MdCall /> },
      { label: "Follow Ups", path: "/crm/followups", icon: <MdAssessment /> },
      { label: "Clients", path: "/crm/clients", icon: <MdBusiness /> },
    ],

    CLIENT: [
      { label: "Projects", path: "/client/projects", icon: <MdDashboard /> },
      { label: "Milestones", path: "/client/milestones", icon: <MdAssessment /> },
      { label: "Files", path: "/client/files", icon: <MdFolderShared /> },
    ],
  };

  return (
    <aside
      className="bg-dark text-white d-flex flex-column"
      style={{
        width: "260px",
        minHeight: "100vh",
        flexShrink: 0,
      }}
    >
      {/* BRAND */}
      <div className="px-3 py-3 border-bottom border-secondary">
        <h5 className="mb-0 fw-bold">Grehasoft</h5>
        <small className="text-secondary">PMS & CRM</small>
      </div>

      {/* MENU */}
      <div className="flex-grow-1 p-2">
        {menu[role]?.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none mb-1 ${
                isActive ? "bg-primary text-white" : "text-light"
              }`
            }
          >
            <span className="fs-5">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* LOGOUT */}
      <div className="p-3 border-top border-secondary">
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <MdLogout /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
