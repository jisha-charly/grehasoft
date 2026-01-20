import { useState } from "react";
import "../css/login.css";
import logo from "../assets/grehasoft-logo.png";
import { useNavigate } from "react-router-dom";
import type { LoginFormData } from "../types";
import api from "../api/axios";

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("token/", {
        username: formData.username,
        password: formData.password,
      });

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      navigate("/admin/dashboard");
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert("Invalid username or password");
      } else {
        alert("Server not reachable");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={logo} alt="Grehasoft Logo" className="logo" />
          <h2 className="logo-text">Grehasoft</h2>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="login-footer">
          © 2026 Grehasoft. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
