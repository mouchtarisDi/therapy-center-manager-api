export interface Payment {
  id: number;
  center_id: number;
  student_id: number;
  amount: number;
  method: string;
  notes: string | null;
  paid_at: string;
}