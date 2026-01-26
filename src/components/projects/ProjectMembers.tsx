import { useEffect, useState } from "react";
import {
  getMembers,
  addMember,
  updateMember,
  removeMember,
} from "../../api/projects";
import api from "../../api/axios";

interface Props {
  projectId: number;
}

const ProjectMembers = ({ projectId }: Props) => {
  const [members, setMembers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("MEMBER");

  const [editing, setEditing] = useState<any | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);

  const loadMembers = async () => {
    const res = await getMembers(projectId);
    setMembers(res.data);
  };

  const loadUsers = async () => {
    const res = await api.get("/users/");
    setUsers(res.data);
  };

  useEffect(() => {
    loadMembers();
    loadUsers();
  }, [projectId]);

  /* ADD MEMBER */
  const submit = async () => {
    if (!userId) {
      alert("Select a user");
      return;
    }

    await addMember(projectId, {
      user: Number(userId),
      role_in_project: role,
    });

    setUserId("");
    setRole("MEMBER");
    loadMembers();
  };

  /* UPDATE MEMBER */
  const saveEdit = async () => {
    await updateMember(editing.id, {
      role_in_project: editing.role_in_project,
    });
    setEditing(null);
    loadMembers();
  };

  /* CONFIRM DELETE */
  const confirmRemove = async () => {
    if (!confirmDelete) return;
    await removeMember(confirmDelete.id);
    setConfirmDelete(null);
    loadMembers();
  };

  return (
    <>
      <h5>Project Members</h5>

      {/* ADD MEMBER */}
      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <select
            className="form-select"
            value={userId}
            onChange={e => setUserId(e.target.value)}
          >
            <option value="">Select User</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="PM">PM</option>
            <option value="MEMBER">Member</option>
            <option value="QA">QA</option>
            <option value="VIEWER">Viewer</option>
          </select>
        </div>

        <div className="col-md-2">
          <button className="btn btn-success w-100" onClick={submit}>
            Add Member
          </button>
        </div>
      </div>

      {/* MEMBERS TABLE */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th style={{ width: "160px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.id}>
              <td>{m.username}</td>

              <td>
                {editing?.id === m.id ? (
                  <select
                    className="form-select form-select-sm"
                    value={editing.role_in_project}
                    onChange={e =>
                      setEditing({
                        ...editing,
                        role_in_project: e.target.value,
                      })
                    }
                  >
                    <option value="PM">PM</option>
                    <option value="MEMBER">Member</option>
                    <option value="QA">QA</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                ) : (
                  m.role_in_project
                )}
              </td>

              <td>
                {editing?.id === m.id ? (
                  <>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={saveEdit}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setEditing(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => setEditing(m)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setConfirmDelete(m)}
                    >
                      Remove
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}

          {!members.length && (
            <tr>
              <td colSpan={3} className="text-center">
                No members added
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* DELETE CONFIRM MODAL */}
      {confirmDelete && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Removal</h5>
              </div>

              <div className="modal-body">
                Remove <strong>{confirmDelete.username}</strong> from this
                project?
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={confirmRemove}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectMembers;
