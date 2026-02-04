// src/types/dashboard.ts

export interface DashboardStats {
  // Projects
  total_projects: number;
  ongoing_projects: number;
  completed_projects: number;
  not_started: number
  // Clients
  total_clients: number;
  active_clients: number;

  // Users
  total_users: number;

  // Tasks
  total_tasks: number;
  tasks_todo: number;
  tasks_in_progress: number;
  tasks_done: number;
}
