import { isRouteErrorResponse, useRouteError, useNavigate } from "react-router-dom";

const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let message = "Something went wrong";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      message = "This page does not exist";
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="text-center p-5 bg-white rounded shadow-sm" style={{ maxWidth: 420 }}>
        <h1 className="display-6 fw-bold text-danger">Oops!</h1>
        <h5 className="mt-3">{message}</h5>

        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/admin/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ErrorBoundary;
