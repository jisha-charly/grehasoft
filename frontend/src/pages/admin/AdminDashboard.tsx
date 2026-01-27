import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { Outlet } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Topbar */}
        <Topbar title="Grehasoft PMS - Admin" />

        {/* Page Content */}
        <main className="flex-grow-1 p-4 bg-light">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
