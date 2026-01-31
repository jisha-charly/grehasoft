import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { getTasksByProject, reorderTasks } from "../../api/services/task.service";
import { KANBAN_COLUMNS } from "../../constants/kanban";
import KanbanColumn from "./KanbanColumn";
import { Task, TaskStatus } from "../../types/task";

export default function KanbanBoard({ projectId }: { projectId: number }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  // ================= LOAD TASKS =================
  useEffect(() => {
    getTasksByProject(projectId).then(res => {
      if (Array.isArray(res.data)) {
        setTasks(res.data);
      }
    });
  }, [projectId]);

  // ================= GROUP BY STATUS =================
  const grouped = (status: TaskStatus) =>
    tasks
      .filter(t => t.status === status)
      .sort((a, b) => a.board_order - b.board_order);

  // ================= DRAG END =================
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const draggedTask = tasks.find(t => t.id === active.id);
    if (!draggedTask) return;

    // Determine new status
    const newStatus = KANBAN_COLUMNS.some(c => c.id === over.id)
      ? (over.id as TaskStatus)
      : draggedTask.status;

    // Update task status
    let updatedTasks: Task[] = tasks.map(t =>
      t.id === draggedTask.id
        ? { ...t, status: newStatus }
        : t
    );

    // Recalculate board_order per column
    KANBAN_COLUMNS.forEach(col => {
      const columnTasks = updatedTasks
        .filter(t => t.status === col.id)
        .sort((a, b) => a.board_order - b.board_order)
        .map((t, index) => ({ ...t, board_order: index }));

      updatedTasks = updatedTasks.map(
        t => columnTasks.find(ct => ct.id === t.id) ?? t
      );
    });

    setTasks(updatedTasks);

    // Save order to backend
    await reorderTasks(
      updatedTasks.map(t => ({
        id: t.id,
        status: t.status,
        board_order: t.board_order,
      }))
    );
  };

  // ================= UI =================
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="row">
        {KANBAN_COLUMNS.map(col => (
          <KanbanColumn
            key={col.id}
            columnId={col.id}
            title={col.title}
            tasks={grouped(col.id)}
          />
        ))}
      </div>
    </DndContext>
  );
}
