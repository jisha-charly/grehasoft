import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="text-center p-5 bg-white rounded shadow-sm" style={{ maxWidth: 420 }}>
        <h1 className="display-6 fw-bold text-danger">404</h1>
        <h5 className="mt-3">This page does not exist</h5>
        <p className="text-muted mt-2">
          The page you are trying to access was not found or may have been removed.
        </p>

        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/admin/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
