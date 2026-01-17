import { useNavigate } from "react-router-dom";

function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="topbar">
      <h3>Grehasoft PMS - Admin</h3>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Topbar;
