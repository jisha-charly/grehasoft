export interface User {
  id: number;
  username: string;
  email: string;
  role: string;      // role name (ADMIN)
  role_id: number;   // role ID (1)
  is_active: boolean;
}

