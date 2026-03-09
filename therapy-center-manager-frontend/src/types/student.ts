export interface Student {
  id: number;
  center_id: number;
  first_name: string;
  last_name: string;
  amka: string | null;
  birth_date: string | null;
  phone: string | null;
  address: string | null;
  guardian_full_name: string | null;
  guardian_phone: string | null;
  guardian_email: string | null;
  diagnosis_notes: string | null;
  assessment_expiry_date: string | null;
  approved_sessions: number;
  remaining_sessions: number;
  notes: string | null;
}

export interface CreateStudentPayload {
  first_name: string;
  last_name: string;
  amka: string | null;
  birth_date: string | null;
  phone: string | null;
  address: string | null;
  guardian_full_name: string | null;
  guardian_phone: string | null;
  guardian_email: string | null;
  diagnosis_notes: string | null;
  assessment_expiry_date: string | null;
  approved_sessions: number;
  remaining_sessions: number;
  notes: string | null;
}