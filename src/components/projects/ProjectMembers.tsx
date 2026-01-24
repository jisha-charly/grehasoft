import { useEffect, useState } from "react";
import { getMembers, addMember } from "../../api/projects";

const ProjectMembers = ({ projectId }: any) => {
  const [members, setMembers] = useState<any[]>([]);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("MEMBER");

  const load = async () => {
    const res = await getMembers(projectId);
    setMembers(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    await addMember(projectId, {
      user: userId,
      role_in_project: role,
    });
    setUserId("");
    load();
  };

  return (
    <>
      <h5>Members</h5>

      <div className="row g-2 mb-3">
        <div className="col">
          <input
            className="form-control"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div className="col">
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="PM">PM</option>
            <option value="MEMBER">Member</option>
            <option value="QA">QA</option>
            <option value="VIEWER">Viewer</option>
          </select>
        </div>
        <div className="col">
          <button className="btn btn-success" onClick={add}>
            Add
          </button>
        </div>
      </div>

      <ul className="list-group">
        {members.map((m) => (
          <li key={m.id} className="list-group-item">
            User #{m.user} — {m.role_in_project}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ProjectMembers;
