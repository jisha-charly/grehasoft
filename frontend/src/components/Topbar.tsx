import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdSettings, MdLogout } from "react-icons/md";
import api from "../api/axios"; // ✅ your axios instance

interface TopbarProps {
  title: string;
}

const Topbar: React.FC<TopbarProps> = ({ title }) => {
  const navigate = useNavigate();

  // 🔹 USER INFO
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const username: string = user?.username || "Admin";
  const roleName: string = user?.role?.name || "ADMIN";

  // 🔍 GLOBAL SEARCH STATE
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    window.location.replace("/login");
  };

  // 🔍 DEBOUNCED SEARCH
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get(`/search/?q=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error("Global search error", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <nav className="navbar bg-white border-bottom px-4 py-2 d-flex justify-content-between align-items-center">
      {/* LEFT: PAGE TITLE */}
      <h5 className="mb-0 fw-semibold">{title}</h5>

      {/* CENTER: GLOBAL SEARCH */}
      <div className="position-relative" style={{ width: 360 }}>
        <input
          type="text"
          className="form-control rounded-pill ps-4"
          placeholder=" 🔍 Search projects,employees..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* SEARCH RESULTS */}
        {results && (
          <div className="position-absolute bg-white shadow rounded-3 w-100 mt-2 p-2 z-3">
            {/* PROJECTS */}
            {results.projects?.length > 0 && (
              <>
                <small className="text-muted fw-semibold">Projects</small>
                {results.projects.map((p: any) => (
                  <div
                    key={p.id}
                    className="dropdown-item cursor-pointer"
                    onClick={() => {
  navigate("/admin/projects", {
    state: { highlightProjectId: p.id },
  });
  setQuery("");
}}

                  >
                    📁 {p.name}
                  </div>
                ))}
              </>
            )}

        

            {/* USERS */}
            {results.users?.length > 0 && (
              <>
                <small className="text-muted fw-semibold mt-2 d-block">
                  Employees
                </small>
                {results.users.map((u: any) => (
                  <div
                    key={u.id}
                    className="dropdown-item cursor-pointer"
                   onClick={() => {
  navigate("/admin/users", {
    state: { highlightUserId: u.id },
  });
  setQuery("");
}}
                  >
                    👤 {u.username}
                  </div>
                ))}
              </>
            )}

            {/* EMPTY STATE */}
            {!loading &&
              results.projects.length === 0 &&
              
              results.users.length === 0 && (
                <div className="text-muted small text-center py-2">
                  No results found
                </div>
              )}
          </div>
        )}
      </div>

      {/* RIGHT: USER DROPDOWN */}
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

          {/* USER INFO */}
          <div className="text-start lh-sm">
            <div className="fw-medium text-capitalize">{username}</div>
            <small className="text-muted">
              {roleName.replace("_", " ")}
            </small>
          </div>
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
