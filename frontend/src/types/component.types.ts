import type { UserRole } from "./user.types";
import type { ReactNode } from "react";

export interface WithChildren {
  children: ReactNode;
}

export interface SidebarItem {
  label: string;
  path: string;
  icon?: ReactNode;
  roles?: UserRole[];
}
export interface TopbarProps {
  title: string;
  showLogout?: boolean;
}
