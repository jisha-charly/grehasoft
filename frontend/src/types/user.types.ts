// Allowed roles
export type UserRole = "admin" | "employee";

// Base user type
export interface User {
  id?: number;
  username: string;
  role: UserRole;
}

// Employee-specific data
export interface Employee extends User {
  department?: string;
  designation?: string;
}

// Admin-specific data
export interface Admin extends User {
  permissions?: string[];
}
