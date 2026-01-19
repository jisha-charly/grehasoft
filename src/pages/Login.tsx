import { useState } from "react";
import "../css/login.css";
import logo from "../assets/grehasoft-logo.png";
import { useNavigate } from "react-router-dom";
import type { LoginFormData, LoginResponse } from "../types";

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: LoginResponse = await response.json();

      if (response.ok) {
        localStorage.setItem("role", data.role);
        navigate("/admin/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Server not reachable");
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
