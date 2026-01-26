export interface Project {
  id: number;
  name: string;
  client: number;
  department?: number | null;
  project_manager?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
}

/* Payloads */
export interface CreateProjectPayload {
  name: string;
  client: number;
  department?: number | null;
  project_manager?: number | null;
  start_date?: string | null;
  end_date?: string | null;
}

export type UpdateProjectPayload = Partial<CreateProjectPayload>;
