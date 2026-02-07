export interface ProjectMember {
  id: number;
  user: number;
  username: string;   // ✅ THIS WAS MISSING
  role_in_project: string;
}
