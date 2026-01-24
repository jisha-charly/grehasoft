import { useEffect, useState } from "react";
import { getMilestones, addMilestone } from "../../api/projects";

const Milestones = ({ projectId }: any) => {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const load = async () => {
    const res = await getMilestones(projectId);
    setMilestones(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    await addMilestone(projectId, { title, due_date: dueDate });
    setTitle("");
    setDueDate("");
    load();
  };

  return (
    <>
      <h5>Milestones</h5>

      <div className="row g-2 mb-3">
        <div className="col">
          <input
            className="form-control"
            placeholder="Milestone title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="date"
            className="form-control"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="col">
          <button className="btn btn-success" onClick={add}>
            Add
          </button>
        </div>
      </div>

      <ul className="list-group">
        {milestones.map((m) => (
          <li key={m.id} className="list-group-item">
            {m.title} — {m.status}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Milestones;
