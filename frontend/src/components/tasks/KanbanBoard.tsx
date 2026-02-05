import KanbanColumn from "./KanbanColumn";
import TaskDetails from "./TaskDetails";
import { useState } from "react";
import type { Task } from "../../types/task";

interface Props {
  tasks: Task[];
}

const KanbanBoard = ({ tasks }: Props) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <>
      <div className="row g-4 mt-3">
        <KanbanColumn
          title="To Do"
          status="todo"
          tasks={tasks}
          onTaskClick={handleTaskClick}
        />
        <KanbanColumn
          title="In Progress"
          status="in_progress"
          tasks={tasks}
          onTaskClick={handleTaskClick}
        />
        <KanbanColumn
          title="Done"
          status="done"
          tasks={tasks}
          onTaskClick={handleTaskClick}
        />
        <KanbanColumn
          title="Blocked"
          status="blocked"
          tasks={tasks}
          onTaskClick={handleTaskClick}
        />
      </div>

      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
};

export default KanbanBoard;
