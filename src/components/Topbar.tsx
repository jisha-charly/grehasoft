import { useNavigate } from "react-router-dom";
import type { TopbarProps } from "../types";

const Topbar: React.FC<TopbarProps> = ({
  title,
  showLogout = true,
}) => {
  const navigate = useNavigate();

  const handleLogout = (): void => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="topbar">
      <h3>{title}</h3>

      {showLogout && (
        <button onClick={handleLogout}>Logout</button>
      )}
    </div>
  );
};

export default Topbar;
