import { useState } from "react";
import "../css/login.css";
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
      {/* your JSX */}
    </div>
  );
};

export default Login;
