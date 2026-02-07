import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";
import TaskDetailsModal from "./TaskDetailsModal";
import type { Task } from "../../types/task";
import { updateTaskStatus } from "../../api/services/task.service";
import "../../css/kanban.css";

interface Props {
  tasks: Task[];
  reload: () => void;
}

const KanbanBoard = ({ tasks, reload }: Props) => {
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  /* ---------------- Sync props → local state ---------------- */
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  /* ---------------- Task click ---------------- */
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  /* ---------------- Save from modal ---------------- */
  const handleTaskUpdate = (updatedTask: Task) => {
    // Update UI immediately
    setLocalTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );

    // Keep modal in sync
    setSelectedTask(updatedTask);
  };

  /* ---------------- Drag & drop ---------------- */
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const taskId = Number(draggableId);
    const newStatus = destination.droppableId as Task["status"];

    // Optimistic UI update
    setLocalTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error("Failed to update task status", err);
      reload(); // fallback
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="row g-4 mt-3">
          <KanbanColumn
            title="To Do"
            status="todo"
            tasks={localTasks}
            onTaskClick={handleTaskClick}
          />

          <KanbanColumn
            title="In Progress"
            status="in_progress"
            tasks={localTasks}
            onTaskClick={handleTaskClick}
          />

          <KanbanColumn
            title="Done"
            status="done"
            tasks={localTasks}
            onTaskClick={handleTaskClick}
          />

          <KanbanColumn
            title="Blocked"
            status="blocked"
            tasks={localTasks}
            onTaskClick={handleTaskClick}
          />
        </div>
      </DragDropContext>

      {/* ---------------- Task Details Modal ---------------- */}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleTaskUpdate}
        />
      )}
    </>
  );
};

export default KanbanBoard;
