export interface ProjectMember {
  id: number;
  user: number;
  username: string;
  role_in_project: "PM" | "MEMBER" | "QA" | "VIEWER";
}
