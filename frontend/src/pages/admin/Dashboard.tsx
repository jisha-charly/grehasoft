const Dashboard = () => {
  return (
    <>
      <h2>Dashboard</h2>

      <div className="row g-3 mt-3">
        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h6>Total Projects</h6>
            <h3>0</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h6>Ongoing Projects</h6>
            <h3>0</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h6>Active Clients</h6>
            <h3>0</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h6>Total Tasks</h6>
            <h3>0</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
