import "../../css/admin-modern.css"; 
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "../ErrorBoundary";


const AdminLayout = () => {
  return (
    <div className="d-flex min-vh-100">
      <Sidebar />

      <div className="flex-grow-1">
        <Topbar title="Grehasoft PMS - Admin" />

        {/* IMPORTANT */}
        <main className="container-fluid py-4 bg-light">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
