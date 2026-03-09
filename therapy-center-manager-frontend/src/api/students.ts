import { api } from "./client";
import type { CreateStudentPayload, Student } from "../types/student";

export async function getStudents(q?: string) {
  const response = await api.get<Student[]>("/students/", {
    params: q ? { q } : {},
  });
  return response.data;
}

export async function getStudentById(studentId: number) {
  const response = await api.get<Student>(`/students/${studentId}`);
  return response.data;
}

export async function createStudent(payload: CreateStudentPayload) {
  const response = await api.post<Student>("/students/", payload);
  return response.data;
}