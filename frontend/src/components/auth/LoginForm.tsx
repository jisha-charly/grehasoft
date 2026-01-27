import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <>
      {error && <div className="alert alert-danger py-2">{error}</div>}

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
            type={showPassword ? "text" : "password"}
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="mt-1 text-end">
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide password" : "Show password"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </>
  );
};

export default LoginForm;
