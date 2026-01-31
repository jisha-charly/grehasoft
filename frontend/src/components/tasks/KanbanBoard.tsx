import KanbanColumn from "./KanbanColumn";
import type { Task } from "../../types/task";

interface Props {
  tasks: Task[];
}

const KanbanBoard = ({ tasks }: Props) => {
  return (
    <div className="row g-4 mt-3">
      <KanbanColumn title="To Do" status="todo" tasks={tasks} />
      <KanbanColumn title="In Progress" status="in_progress" tasks={tasks} />
      <KanbanColumn title="Done" status="done" tasks={tasks} />
      <KanbanColumn title="Blocked" status="blocked" tasks={tasks} />
    </div>
  );
};

export default KanbanBoard;
