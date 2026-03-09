export type SessionStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export interface TherapySession {
  id: number;
  center_id: number;
  student_id: number;
  therapist_user_id: number | null;
  scheduled_at: string;
  status: SessionStatus;
  notes: string | null;
  created_at: string;
}