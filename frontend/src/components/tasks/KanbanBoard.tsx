import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";
import type { Task } from "../../types/task";
import { updateTaskStatus } from "../../api/services/task.service";
import "../../css/kanban.css";

interface Props {
  tasks: Task[];
  reload: () => void;
}

const KanbanBoard = ({ tasks, reload }: Props) => {
  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  // Sync props → local state
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const taskId = Number(draggableId);
    const newStatus = destination.droppableId as Task["status"];

    // 🔹 1. Update UI immediately
    setLocalTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      )
    );

    // 🔹 2. Update backend
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error("Failed to update task status", err);
      reload(); // fallback if API fails
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="row g-4 mt-3">
        <KanbanColumn title="To Do" status="todo" tasks={localTasks} />
        <KanbanColumn title="In Progress" status="in_progress" tasks={localTasks} />
        <KanbanColumn title="Done" status="done" tasks={localTasks} />
        <KanbanColumn title="Blocked" status="blocked" tasks={localTasks} />
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
