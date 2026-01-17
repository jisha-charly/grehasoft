import { useState } from "react";
import "../css/login.css";
import logo from "../assets/grehasoft-logo.png";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin@g.com" && password === "admin123") {
      localStorage.setItem("role", "admin");
      navigate("/admin/dashboard");
    } else if (email === "emp@grehasoft.com" && password === "emp123") {
      localStorage.setItem("role", "employee");
      navigate("/employee/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo / Brand */}
        <div className="login-header">
          {/* Replace text with <img /> later */}
          <div className="login-header">
            <img src={logo} alt="Grehasoft Logo" className="logo" />
          </div>

          <p>Project Management & CRM System</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@grehasoft.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          © {new Date().getFullYear()} Grehasoft Technologies
        </div>
      </div>
    </div>
  );
}

export default Login;
