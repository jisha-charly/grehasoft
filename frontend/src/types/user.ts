// src/types/user.ts

export interface User {
  id: number;
  username: string;
  email: string;

  role_id: number;
  role: string;

  department_id: number | null;
  department: string | null;

  is_active: boolean;
  created_at?: string;
}
