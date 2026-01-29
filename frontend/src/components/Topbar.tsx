import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TopbarProps {
  title: string;
}

const Topbar: React.FC<TopbarProps> = ({ title }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const goToSettings = () => {
    navigate("/admin/settings");
    setOpen(false);
  };

  return (
    <nav className="navbar navbar-light bg-white border-bottom px-4 py-2 d-flex justify-content-between">
      <h5 className="mb-0 fw-semibold">{title}</h5>

      <div className="position-relative">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setOpen(!open)}
        >
          Admin ▾
        </button>

        {open && (
          <div
            className="dropdown-menu show end-0 mt-2"
            style={{ position: "absolute" }}
          >
            <button className="dropdown-item" onClick={goToSettings}>
              Settings
            </button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item text-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Topbar;
