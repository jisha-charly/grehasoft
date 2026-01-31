import { TaskStatus } from "../types/task";

export const KANBAN_COLUMNS: {
  id: TaskStatus;
  title: string;
}[] = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Done" },
  { id: "blocked", title: "Blocked" },
];
