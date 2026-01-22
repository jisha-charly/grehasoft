import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import logo from "../assets/grehasoft-logo.png";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("token/", { username, password });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      navigate("/admin/dashboard");
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Invalid username or password");
      } else {
        setError("Server not reachable. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg border-0" style={{ width: "420px" }}>
        <div className="card-body p-4">
          {/* Logo */}
          <div className="text-center mb-4">
            <img src={logo} alt="Grehasoft" height={60} />
            <h4 className="mt-3 fw-bold">Grehasoft PMS</h4>
            
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-danger py-2">{error}</div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-4 text-muted small">
            © 2026 Grehasoft. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
