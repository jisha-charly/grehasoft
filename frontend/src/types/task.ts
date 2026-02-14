export type TaskStatus =
  | "todo"
  | "in_progress"
  | "done"
  | "blocked";
  export interface TaskAssignment {
  id: number;
  employee: number;
  employee_name: string;
  assigned_at: string;
  unassigned_at: string | null;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done" | "blocked";
  priority?: "low" | "medium" | "high";
  task_type_id?: number;
  task_type_name?: string;

  project: number; // ✅ FIXED
  project_name: string;   // ✅ ADD THIS
  assignment?: TaskAssignment | null;
  created_at: string;
  updated_at: string;
  due_date?: string | null

}
