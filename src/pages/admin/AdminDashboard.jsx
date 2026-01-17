import "../../css/admin.css";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { Outlet } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;
