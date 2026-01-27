import { useEffect, useState } from "react";
import {
  getMembers,
  addMember,
  updateMember,
  removeMember,
} from "../../api/services/projectMember.service";
import { getUsers } from "../../api/services/user.service";

import type { ProjectMember } from "../../types/projectMember";
import type { User } from "../../types/user";

type ProjectRole = "PM" | "MEMBER" | "QA" | "VIEWER";

interface Props {
  projectId: number;
}

const ProjectMembers = ({ projectId }: Props) => {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [userId, setUserId] = useState<number | "">("");
  const [role, setRole] = useState<ProjectRole>("MEMBER");

  const [editing, setEditing] = useState<ProjectMember | null>(null);
  const [confirmDelete, setConfirmDelete] =
    useState<ProjectMember | null>(null);

  const loadMembers = async () => {
    const data = await getMembers(projectId);
    setMembers(data);
  };

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadMembers();
    loadUsers();
  }, [projectId]);

  /* ADD MEMBER */
  const submit = async () => {
    if (!userId) return;

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
    if (!editing) return;

    await updateMember(editing.id, {
      role_in_project: editing.role_in_project,
    });

    setEditing(null);
    loadMembers();
  };

  /* REMOVE MEMBER */
  const confirmRemove = async () => {
    if (!confirmDelete) return;

    await removeMember(confirmDelete.id);
    setConfirmDelete(null);
    loadMembers();
  };

  return (
    <>
      <h5 className="mb-3">Project Members</h5>

      {/* ADD MEMBER FORM */}
      <div className="row g-2 mb-4">
        <div className="col-md-5">
          <select
            className="form-select"
            value={userId}
            onChange={(e) =>
              setUserId(e.target.value ? Number(e.target.value) : "")
            }
          >
            <option value="">Select User</option>
            {users.map((u) => (
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
            onChange={(e) =>
              setRole(e.target.value as ProjectRole)
            }
          >
            <option value="PM">PM</option>
            <option value="MEMBER">Member</option>
            <option value="QA">QA</option>
            <option value="VIEWER">Viewer</option>
          </select>
        </div>

        <div className="col-md-3">
          <button className="btn btn-success w-100" onClick={submit}>
            Add Member
          </button>
        </div>
      </div>

      {/* MEMBERS TABLE */}
      <table className="table table-bordered align-middle">
        <thead className="table-light">
          <tr>
            <th>User</th>
            <th>Role</th>
            <th style={{ width: 180 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td>{m.username}</td>

              <td>
                {editing?.id === m.id ? (
                  <select
                    className="form-select form-select-sm"
                    value={editing.role_in_project}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        role_in_project: e.target.value as ProjectRole,
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
                Remove{" "}
                <strong>{confirmDelete.username}</strong> from this project?
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
