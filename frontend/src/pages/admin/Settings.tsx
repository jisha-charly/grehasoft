import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile, changePassword } from "../../api/services/profile.service";

const Settings = () => {
  const navigate = useNavigate();

  // INITIAL DATA
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [email, setEmail] = useState("");

  // PASSWORD
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* =========================
     UPDATE PROFILE
  ========================= */
  const handleProfileUpdate = async () => {
    setError(null);
    setSuccess(null);

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    try {
      setLoading(true);
     await updateProfile({
  username,
  ...(email ? { email } : {}),
});

      localStorage.setItem("username", username);
      setSuccess("Profile updated successfully");
    } catch (err: any) {
      setError(err.response?.data?.error || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     CHANGE PASSWORD
  ========================= */
  const handleChangePassword = async () => {
    setError(null);
    setSuccess(null);

    if (!oldPassword || !newPassword) {
      setError("Both password fields are required");
      return;
    }

    try {
      setLoading(true);
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });

      // SECURITY: force logout
      localStorage.clear();
      navigate("/");

    } catch (err: any) {
      setError(err.response?.data?.error || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-3">
      <h4>Profile Settings</h4>

      {/* ALERTS */}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* UPDATE PROFILE */}
      <div className="card mb-4">
        <div className="card-body">
          <h6 className="mb-3">Update Profile</h6>

          <input
            className="form-control mb-2"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={handleProfileUpdate}
          >
            Update Profile
          </button>
        </div>
      </div>

      {/* CHANGE PASSWORD */}
      <div className="card">
        <div className="card-body">
          <h6 className="mb-3">Change Password</h6>

          <input
            type="password"
            className="form-control mb-2"
            placeholder="Current Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            className="btn btn-warning"
            disabled={loading}
            onClick={handleChangePassword}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
