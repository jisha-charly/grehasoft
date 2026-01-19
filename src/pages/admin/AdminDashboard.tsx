import "./admin.css";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { Outlet } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
