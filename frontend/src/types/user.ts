// src/types/user.ts

export interface User {
  id: number;
  username: string;
  email: string;
  role_id: number;
  role_name: string;
  department_id: number | null;
  department_name: string | null;
  is_active: boolean;
}

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  role: number;
  department: number | null;
}

export interface UpdateUserPayload {
  email: string;
  role: number;
  department: number | null;
  is_active: boolean;
}
