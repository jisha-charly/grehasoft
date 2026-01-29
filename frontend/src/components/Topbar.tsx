import { useNavigate } from "react-router-dom";
import { MdSettings, MdLogout } from "react-icons/md";

interface TopbarProps {
  title: string;
}

const Topbar: React.FC<TopbarProps> = ({ title }) => {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Admin";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar bg-white border-bottom px-4 py-2 d-flex justify-content-between">
      <h5 className="mb-0 fw-semibold">{title}</h5>

      {/* USER DROPDOWN */}
      <div className="dropdown">
        <button
          className="btn btn-light dropdown-toggle d-flex align-items-center gap-2 rounded-pill px-3"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {/* AVATAR */}
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32, fontSize: 14 }}
          >
            {username.charAt(0).toUpperCase()}
          </div>

          {/* USERNAME */}
          <span className="fw-medium text-capitalize">{username}</span>
        </button>

        <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2">
          <li>
            <button
              className="dropdown-item d-flex align-items-center gap-2"
              onClick={() => navigate("/admin/settings")}
            >
              <MdSettings size={18} />
              Settings
            </button>
          </li>

          <li>
            <hr className="dropdown-divider" />
          </li>

          <li>
            <button
              className="dropdown-item d-flex align-items-center gap-2 text-danger"
              onClick={handleLogout}
            >
              <MdLogout size={18} />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Topbar;
