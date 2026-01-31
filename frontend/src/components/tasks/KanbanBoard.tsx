import { useEffect, useState } from "react";
import { getTasksByProject } from "../../api/services/task.service";
import KanbanColumn from "./KanbanColumn";
import type { Task } from "../../types/task";

interface Props {
  projectId: number;
}

const KanbanBoard = ({ projectId }: Props) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  const loadTasks = async () => {
    const data = await getTasksByProject(projectId);
    setTasks(data);
  };

  return (
    <div className="row g-3 mt-3">
      <KanbanColumn title="To Do" status="todo" tasks={tasks} />
      <KanbanColumn title="In Progress" status="in_progress" tasks={tasks} />
      <KanbanColumn title="Done" status="done" tasks={tasks} />
      <KanbanColumn title="Blocked" status="blocked" tasks={tasks} />
    </div>
  );
};

export default KanbanBoard;
