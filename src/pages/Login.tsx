import LoginHeader from "../components/auth/LoginHeader";
import LoginForm from "../components/auth/LoginForm";
import LoginFooter from "../components/auth/LoginFooter";
import "../css/login.css";

const Login = () => {
  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center login-bg">
      <div className="card shadow-lg border-0" style={{ width: "420px" }}>
        <div className="card-body p-4">
          <LoginHeader />
          <LoginForm />
          <LoginFooter />
        </div>
      </div>
    </div>
  );
};

export default Login;
