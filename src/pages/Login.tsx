import { useState } from "react";
import "../styles/login.css";
import logo from "../assets/grehasoft-logo.png";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>): void => {
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
          <img src={logo} alt="Grehasoft Logo" className="logo" />
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
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
};

export default Login;
