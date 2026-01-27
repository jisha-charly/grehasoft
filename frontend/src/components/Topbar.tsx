import { useNavigate } from "react-router-dom";

interface TopbarProps {
  title: string;
}

const Topbar: React.FC<TopbarProps> = ({ title }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-light bg-white border-bottom px-4 py-2">
      <h5 className="mb-0 fw-semibold">{title}</h5>

      <button
        className="btn btn-outline-danger btn-sm"
        onClick={handleLogout}
      >
        Logout
      </button>
    </nav>
  );
};

export default Topbar;
