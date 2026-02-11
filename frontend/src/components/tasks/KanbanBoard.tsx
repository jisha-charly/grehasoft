import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";
// import TaskDetailsModal from "./TaskDetailsModal";
import TaskDetailsModal1 from "./TaskDetailsModal1";
import type { Task } from "../../types/task";
import {
  updateTaskStatus,
  deleteTask,
} from "../../api/services/task.service";
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
    setLocalTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    setSelectedTask(updatedTask);
  };

  /* ---------------- DELETE TASK ---------------- */
 const handleDeleteTask = async (taskId: number) => {
  try {
    await deleteTask(taskId);
    reload();
  } catch (err) {
    console.error("Failed to delete task", err);
    alert("Failed to delete task");
  }
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
            onTaskDelete={handleDeleteTask}
          />

          <KanbanColumn
            title="In Progress"
            status="in_progress"
            tasks={localTasks}
            onTaskClick={handleTaskClick}
            onTaskDelete={handleDeleteTask}
          />

          <KanbanColumn
            title="Done"
            status="done"
            tasks={localTasks}
            onTaskClick={handleTaskClick}
            onTaskDelete={handleDeleteTask}
          />

          <KanbanColumn
            title="Blocked"
            status="blocked"
            tasks={localTasks}
            onTaskClick={handleTaskClick}
            onTaskDelete={handleDeleteTask}
          />
        </div>
      </DragDropContext>

      {/* ---------------- Task Details Modal ---------------- */}
      {selectedTask && (
        <TaskDetailsModal1
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleTaskUpdate}
        />
      )}
    </>
  );
};

export default KanbanBoard;
