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
}

/* ---------- CREATE ---------- */
export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  role: number;
  department: number | null;
}

/* ---------- UPDATE ---------- */
export interface UpdateUserPayload {
  email: string;
  role: number;
  department: number | null;
  is_active: boolean;
}
