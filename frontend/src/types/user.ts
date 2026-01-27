export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  role: string;
  role_id: number;
  department: string | null;
  department_id: number | null;
  created_at: string;
}

