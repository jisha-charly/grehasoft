const Settings = () => {
  return (
    <div className="container mt-3">
      <h4>Profile Settings</h4>

      <div className="card mt-3">
        <div className="card-body">
          <h6>Update Profile</h6>

          <input className="form-control mb-2" placeholder="Username" disabled />
          <input className="form-control mb-2" placeholder="Email" />

          <button className="btn btn-primary mt-2">Update Profile</button>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-body">
          <h6>Change Password</h6>

          <input
            type="password"
            className="form-control mb-2"
            placeholder="Current Password"
          />
          <input
            type="password"
            className="form-control mb-2"
            placeholder="New Password"
          />

          <button className="btn btn-warning mt-2">Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
