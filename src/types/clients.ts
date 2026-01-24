/* ---------------- TYPES ---------------- */
export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  company_name: string;
  gst_no: string | null;
  address: string;
  created_at: string;
}