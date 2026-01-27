export interface Department {
  id: number;
  name: string;
  parent_id: number | null;
  parent_name: string | null;
  created_at: string;
}