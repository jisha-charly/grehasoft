import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { isAuthenticated } from "../../utils/auth";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Clear any lingering toasts/alerts when showing login so previous messages
  // (eg. 'Password changed') do not appear on the login screen.
  useEffect(() => {
    toast.dismiss();
    // If already authenticated, redirect to dashboard and replace history so
    // back button doesn't go back to login
    if (isAuthenticated()) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    /* ================= CUSTOM VALIDATION ================= */
    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/token/", {
        username,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // Replace history entry so user cannot navigate back to login with back button
      navigate("/admin/dashboard", { replace: true });
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
      {/* 🔴 CUSTOM ERROR MESSAGE */}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <form onSubmit={handleLogin} noValidate>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            autoComplete="off"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
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
