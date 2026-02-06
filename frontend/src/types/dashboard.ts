// src/types/dashboard.ts

export interface DashboardStats {
  // Projects
  total_projects: number;
  projects_not_started: number;
  projects_in_progress: number;
  projects_completed: number;

  // Clients
  total_clients: number;
  active_clients: number;

  // Tasks
  total_tasks: number;
  tasks_todo: number;
  tasks_in_progress: number;
  tasks_done: number;
}
