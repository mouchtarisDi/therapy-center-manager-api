import { api } from "./client";
import type { Payment } from "../types/payment";

interface PaymentsParams {
  student_id?: number;
  method?: string;
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
}

export async function getPayments(params?: PaymentsParams) {
  const response = await api.get<Payment[]>("/payments/", { params });
  return response.data;
}