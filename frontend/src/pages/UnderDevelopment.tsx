const UnderDevelopment = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-75">
      <div className="text-center">
        <h2 className="text-warning mb-2">Under Development</h2>
        <p className="text-muted">
          This section is currently under development.
        </p>

        <button
          className="btn btn-primary mt-3"
          onClick={() => (window.location.href = "/admin/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default UnderDevelopment;
