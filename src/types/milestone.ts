export interface Milestone {
  id: number;
  title: string;
  due_date: string;
  status: "pending" | "completed";
}
