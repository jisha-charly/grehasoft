import type { User, UserRole } from "./user.types";

// Login form data
export interface LoginFormData {
  username: string;
  password: string;
}

// Login API response
export interface LoginResponse {
  message: string;
  username: string;
  role: UserRole;
  token?: string; // for JWT later
}

// Auth state (for Context / Redux later)
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
