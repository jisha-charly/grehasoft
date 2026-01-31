export type TaskStatus =
  | "todo"
  | "in_progress"
  | "done"
  | "blocked";

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  board_order: number;
   task_type_id?: number;
  task_type_name?: string;
  priority?: string;
}
