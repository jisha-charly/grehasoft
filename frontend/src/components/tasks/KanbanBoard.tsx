import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";

import { getTasksByProject, reorderTasks } from "../../api/services/task.service";
import { KANBAN_COLUMNS } from "../../constants/kanban";
import KanbanColumn from "./KanbanColumn";

import type { Task, TaskStatus } from "../../types/task";

interface Props {
  projectId: number;
}

const KanbanBoard = ({ projectId }: Props) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  /* ===============================
     LOAD TASKS BY PROJECT
  =============================== */
  useEffect(() => {
    if (!projectId) return;

    const loadTasks = async () => {
      const res = await getTasksByProject(projectId);
      setTasks(res.data);
    };

    loadTasks();
  }, [projectId]);

  /* ===============================
     GROUP TASKS BY STATUS
  =============================== */
  const grouped = (status: TaskStatus) =>
    tasks
      .filter(t => t.status === status)
      .sort((a, b) => a.board_order - b.board_order);

  /* ===============================
     DRAG END HANDLER
  =============================== */
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const draggedTask = tasks.find(t => t.id === active.id);
    if (!draggedTask) return;

    const newStatus = over.id as TaskStatus;

    // update task status
    let updated: Task[] = tasks.map(t =>
      t.id === draggedTask.id
        ? { ...t, status: newStatus }
        : t
    );

    // reassign board_order per column
    KANBAN_COLUMNS.forEach(col => {
      const columnTasks = updated
        .filter(t => t.status === col.id)
        .map((t, index) => ({
          ...t,
          board_order: index,
        }));

      updated = updated.map(
        t => columnTasks.find(ct => ct.id === t.id) ?? t
      );
    });

    setTasks(updated);

    // persist order to backend
    await reorderTasks(
      updated.map(t => ({
        id: t.id,
        status: t.status,
        board_order: t.board_order,
      }))
    );
  };

  /* ===============================
     RENDER
  =============================== */
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="row mt-3">
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
};

export default KanbanBoard;
