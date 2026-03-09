import { api } from "./client";
import type { TherapySession } from "../types/session";

interface SessionsParams {
  student_id?: number;
  therapist_user_id?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
}

export async function getSessions(params?: SessionsParams) {
  const response = await api.get<TherapySession[]>("/sessions/", { params });
  return response.data;
}